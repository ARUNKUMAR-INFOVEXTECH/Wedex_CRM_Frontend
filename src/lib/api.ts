import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refresh });
          localStorage.setItem("token", data.token);
          localStorage.setItem("refresh_token", data.refresh_token);
          original.headers.Authorization = `Bearer ${data.token}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  profile: () => api.get("/auth/profile"),
};

// ── Admin ─────────────────────────────────────────────
export const adminApi = {
  getStats: () => api.get("/admin/stats"),
  getHalls: () => api.get("/admin/halls"),
  getHall: (id: string) => api.get(`/admin/halls/${id}`),
  createHall: (data: any) => api.post("/admin/halls", data),
  suspendHall: (id: string) => api.patch(`/admin/halls/${id}/suspend`),
  activateHall: (id: string) => api.patch(`/admin/halls/${id}/activate`),
  deleteHall: (id: string) => api.delete(`/admin/halls/${id}`),
};

// ── Packages ──────────────────────────────────────────
export const packageApi = {
  getAll: () => api.get("/packages"),
  create: (data: any) => api.post("/packages", data),
  update: (id: string, data: any) => api.put(`/packages/${id}`, data),
  delete: (id: string) => api.delete(`/packages/${id}`),
};

// ── Subscriptions ─────────────────────────────────────
export const subscriptionApi = {
  getMy: () => api.get("/subscriptions/my"),
  getByHall: (hallId: string) => api.get(`/subscriptions/${hallId}`),
  renew: (hallId: string, months: number) =>
    api.put(`/subscriptions/${hallId}/renew`, { months }),
  changePackage: (hallId: string, packageId: string) =>
    api.patch(`/subscriptions/${hallId}/change-package`, { package_id: packageId }),
};

// ── Staff ─────────────────────────────────────────────
export const staffApi = {
  getAll: () => api.get("/staff"),
  create: (data: any) => api.post("/staff", data),
  update: (id: string, role: string) => api.patch(`/staff/${id}`, { role }),
  delete: (id: string) => api.delete(`/staff/${id}`),
};
