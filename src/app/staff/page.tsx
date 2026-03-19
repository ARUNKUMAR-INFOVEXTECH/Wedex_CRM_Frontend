"use client";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/layout/sidebar";

export default function StaffDashboard() {
  const { user } = useAuth();

  return (
    <div className="page-enter">
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0] || "there"}`}
        subtitle="You're logged in to HallFlow"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem", maxWidth: 640 }}>
        {/* Profile card */}
        <div className="card" style={{ padding: "1.5rem", gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "var(--accent-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--accent)", fontWeight: 700, fontSize: "1.25rem", flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "1.0625rem" }}>{user?.name}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{user?.email}</div>
              <div style={{ marginTop: "0.375rem" }}>
                <span className={`badge ${user?.role === "manager" ? "badge-accent" : "badge-neutral"}`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Role</div>
          <div style={{ fontWeight: 600, textTransform: "capitalize" }}>{user?.role}</div>
        </div>

        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Hall ID</div>
          <div style={{ fontWeight: 600, fontSize: "0.8125rem", wordBreak: "break-all", color: "var(--text-secondary)" }}>{user?.hall_id || "—"}</div>
        </div>
      </div>

      <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "var(--bg-subtle)", borderRadius: "var(--radius-lg)", maxWidth: 640 }}>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
          You have staff-level access. If you need additional permissions, please contact your hall owner or manager.
        </p>
      </div>
    </div>
  );
}
