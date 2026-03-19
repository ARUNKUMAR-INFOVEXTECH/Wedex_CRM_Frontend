"use client";
import { useEffect, useState } from "react";
import { subscriptionApi } from "@/lib/api";
import { PageHeader } from "@/components/layout/sidebar";

export default function OwnerSubscriptionPage() {
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subscriptionApi.getMy()
      .then(r => setSub(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const daysLeft = sub?.end_date
    ? Math.ceil((new Date(sub.end_date).getTime() - Date.now()) / 86400000)
    : null;

  const pct = sub?.start_date && sub?.end_date
    ? Math.max(0, Math.min(100, 100 - (daysLeft! / Math.ceil((new Date(sub.end_date).getTime() - new Date(sub.start_date).getTime()) / 86400000)) * 100))
    : 0;

  return (
    <div className="page-enter">
      <PageHeader title="Subscription" subtitle="Your current plan and billing details" />

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ display: "inline-block", width: 28, height: 28, borderWidth: 3 }} />
        </div>
      ) : !sub ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>No active subscription found. Contact your administrator.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem", alignItems: "start" }}>
          {/* Main card */}
          <div className="card" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.75rem" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.375rem" }}>
                  Current plan
                </div>
                <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.04em" }}>{sub.packages?.name}</h2>
                <div style={{ color: "var(--text-muted)", fontSize: "0.9375rem", marginTop: "0.25rem" }}>
                  ₹{Number(sub.packages?.price).toLocaleString()} / {sub.packages?.billing_cycle}
                </div>
              </div>
              <span className={`badge ${sub.status === "active" ? "badge-success" : "badge-danger"}`} style={{ fontSize: "0.8125rem", padding: "4px 12px" }}>
                {sub.status}
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                <span>Billing period progress</span>
                <span style={{ color: daysLeft !== null && daysLeft <= 7 ? "var(--warning)" : "var(--text-secondary)", fontWeight: 500 }}>
                  {daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} days remaining` : "Expired") : ""}
                </span>
              </div>
              <div style={{ height: 6, background: "var(--bg-subtle)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: daysLeft !== null && daysLeft <= 7 ? "var(--warning)" : "var(--accent)",
                  borderRadius: 99,
                  transition: "width 0.6s ease",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
                <span>{new Date(sub.start_date).toLocaleDateString()}</span>
                <span>{new Date(sub.end_date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Details grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1.75rem" }}>
              {[
                ["Start date", new Date(sub.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })],
                ["End date", new Date(sub.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })],
                ["Payment status", sub.payment_status],
                ["Max users", sub.packages?.max_users ?? "Unlimited"],
                ["Max bookings", sub.packages?.max_bookings ?? "Unlimited"],
                ["Billing cycle", sub.packages?.billing_cycle],
              ].map(([l, v]) => (
                <div key={l} style={{ background: "var(--bg-subtle)", borderRadius: "var(--radius)", padding: "0.875rem 1rem" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{l}</div>
                  <div style={{ fontWeight: 500, fontSize: "0.9375rem", textTransform: "capitalize" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            {Array.isArray(sub.packages?.features) && sub.packages.features.length > 0 && (
              <div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                  Included in your plan
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {sub.packages.features.map((f: string) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--success-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "0.75rem" }}>Need to upgrade?</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
                Contact your administrator to upgrade your plan, renew your subscription, or switch to a different package.
              </p>
              <div style={{ background: "var(--bg-subtle)", borderRadius: "var(--radius)", padding: "0.875rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                <strong>Subscription ID:</strong><br />
                <code style={{ fontSize: "0.78rem", color: "var(--text-muted)", wordBreak: "break-all" }}>{sub.id}</code>
              </div>
            </div>

            {daysLeft !== null && daysLeft <= 30 && (
              <div style={{
                background: daysLeft <= 7 ? "var(--danger-light)" : "var(--warning-light)",
                border: `1px solid ${daysLeft <= 7 ? "#fecaca" : "#fde68a"}`,
                borderRadius: "var(--radius-lg)",
                padding: "1.125rem",
              }}>
                <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: daysLeft <= 7 ? "var(--danger)" : "var(--warning)", marginBottom: "0.375rem" }}>
                  {daysLeft <= 0 ? "⚠ Subscription expired" : `⚠ Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Please contact your super administrator to renew your subscription and avoid service interruption.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
