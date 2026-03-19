"use client";
import { useEffect, useState } from "react";
import { adminApi, packageApi, subscriptionApi } from "@/lib/api";
import { PageHeader, StatCard } from "@/components/layout/sidebar";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0 });
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getHalls()])
      .then(([s, h]) => {
        setStats(s.data);
        setHalls(h.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of all halls and activity"
      />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard
          label="Total halls"
          value={loading ? "—" : stats.total}
          color="accent"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
        />
        <StatCard
          label="Active halls"
          value={loading ? "—" : stats.active}
          color="success"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
        />
        <StatCard
          label="Suspended halls"
          value={loading ? "—" : stats.suspended}
          color="warning"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
        />
      </div>

      {/* Recent halls */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem" }}>Recent Halls</h2>
          <Link href="/admin/halls" style={{ fontSize: "0.875rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
            View all →
          </Link>
        </div>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><div className="spinner" /></div>
          </div>
        ) : halls.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>No halls yet</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Hall", "Owner", "City", "Status", "Subscription"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {halls.map((hall) => {
                const sub = hall.hall_subscriptions?.[0];
                return (
                  <tr key={hall.id} className="table-row">
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{hall.hall_name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{hall.email}</div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>{hall.owner_name}</td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>{hall.city || "—"}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span className={`badge ${hall.status === "active" ? "badge-success" : "badge-warning"}`}>
                        {hall.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      {sub ? (
                        <span className={`badge ${sub.status === "active" ? "badge-accent" : "badge-neutral"}`}>
                          {sub.packages?.name || sub.status}
                        </span>
                      ) : <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>None</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
