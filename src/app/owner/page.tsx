"use client";
import { useEffect, useState } from "react";
import { staffApi, subscriptionApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader, StatCard } from "@/components/layout/sidebar";
import Link from "next/link";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([staffApi.getAll(), subscriptionApi.getMy()])
      .then(([s, sb]) => { setStaff(s.data); setSub(sb.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const daysLeft = sub?.end_date
    ? Math.ceil((new Date(sub.end_date).getTime() - Date.now()) / 86400000)
    : null;

  const managers = staff.filter(s => s.role === "manager").length;
  const staffCount = staff.filter(s => s.role === "staff").length;

  return (
    <div className="page-enter">
      <PageHeader
        title={`Welcome back${user?.name ? ", " + user.name.split(" ")[0] : ""}`}
        subtitle="Here's what's happening with your hall"
      />

      {/* Subscription alert */}
      {daysLeft !== null && daysLeft <= 7 && (
        <div style={{
          background: daysLeft <= 0 ? "var(--danger-light)" : "var(--warning-light)",
          border: `1px solid ${daysLeft <= 0 ? "#fecaca" : "#fde68a"}`,
          borderRadius: "var(--radius-lg)",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={daysLeft <= 0 ? "var(--danger)" : "var(--warning)"} strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div>
            <span style={{ fontWeight: 600, color: daysLeft <= 0 ? "var(--danger)" : "var(--warning)", fontSize: "0.9375rem" }}>
              {daysLeft <= 0 ? "Subscription expired" : `Subscription expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
            </span>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}> — please contact your administrator to renew.</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard
          label="Total staff"
          value={loading ? "—" : staff.length}
          color="accent"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>}
        />
        <StatCard
          label="Managers"
          value={loading ? "—" : managers}
          color="success"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>}
        />
        <StatCard
          label={daysLeft !== null && daysLeft > 0 ? `${daysLeft} days left` : "Subscription"}
          value={loading ? "—" : (sub?.packages?.name || "No plan")}
          color={daysLeft !== null && daysLeft <= 7 ? "warning" : "accent"}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
        />
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {/* Staff summary */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontWeight: 600, fontSize: "1rem" }}>Your Staff</h2>
            <Link href="/owner/staff" style={{ fontSize: "0.875rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
              Manage →
            </Link>
          </div>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center" }}><div className="spinner" style={{ display: "inline-block" }} /></div>
          ) : staff.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>No staff members yet</p>
              <Link href="/owner/staff" className="btn btn-primary btn-sm">Add first staff member</Link>
            </div>
          ) : (
            <div style={{ padding: "0.5rem 0" }}>
              {staff.slice(0, 5).map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 1.5rem" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: s.role === "manager" ? "var(--accent-light)" : "var(--bg-subtle)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: s.role === "manager" ? "var(--accent)" : "var(--text-muted)",
                    fontWeight: 600, fontSize: "0.8125rem", flexShrink: 0,
                  }}>
                    {s.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.email}</div>
                  </div>
                  <span className={`badge ${s.role === "manager" ? "badge-accent" : "badge-neutral"}`}>{s.role}</span>
                </div>
              ))}
              {staff.length > 5 && (
                <div style={{ padding: "0.5rem 1.5rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                  +{staff.length - 5} more
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subscription summary */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontWeight: 600, fontSize: "1rem" }}>Subscription</h2>
            <Link href="/owner/subscription" style={{ fontSize: "0.875rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
              Details →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}><div className="spinner" style={{ display: "inline-block" }} /></div>
          ) : !sub ? (
            <p style={{ color: "var(--text-muted)" }}>No active subscription</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
                  {sub.packages?.name}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                  ₹{sub.packages?.price}/{sub.packages?.billing_cycle}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {[
                  ["Status", <span className={`badge ${sub.status === "active" ? "badge-success" : "badge-danger"}`}>{sub.status}</span>],
                  ["Payment", <span className={`badge ${sub.payment_status === "paid" ? "badge-success" : "badge-warning"}`}>{sub.payment_status}</span>],
                  ["Starts", new Date(sub.start_date).toLocaleDateString()],
                  ["Expires", new Date(sub.end_date).toLocaleDateString()],
                ].map(([l, v]) => (
                  <div key={l as string} style={{ background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", padding: "0.625rem 0.75rem" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{l}</div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>

              {Array.isArray(sub.packages?.features) && sub.packages.features.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Included features</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {sub.packages.features.map((f: string) => (
                      <span key={f} className="badge badge-neutral">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
