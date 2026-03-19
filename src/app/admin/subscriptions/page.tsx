"use client";
import { useEffect, useState } from "react";
import { adminApi, subscriptionApi, packageApi } from "@/lib/api";
import { PageHeader, Modal, FormField, EmptyState, Table } from "@/components/layout/sidebar";
import toast from "react-hot-toast";

export default function SubscriptionsPage() {
  const [halls, setHalls] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewModal, setRenewModal] = useState<any>(null);
  const [changeModal, setChangeModal] = useState<any>(null);
  const [months, setMonths] = useState(1);
  const [newPkgId, setNewPkgId] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.getHalls(), packageApi.getAll()])
      .then(([h, p]) => { setHalls(h.data); setPackages(p.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await subscriptionApi.renew(renewModal.id, months);
      toast.success(`Renewed for ${months} month(s)`);
      setRenewModal(null);
      load();
    } catch (err: any) { toast.error(err?.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const handleChangePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await subscriptionApi.changePackage(changeModal.id, newPkgId);
      toast.success("Package changed successfully");
      setChangeModal(null);
      load();
    } catch (err: any) { toast.error(err?.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const daysLeft = (endDate: string) => {
    const d = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000);
    return d;
  };

  return (
    <div className="page-enter">
      <PageHeader title="Subscriptions" subtitle="Manage hall subscription plans and renewals" />

      <div className="card" style={{ overflow: "hidden" }}>
        <Table headers={["Hall", "Package", "Period", "Days left", "Payment", "Actions"]} loading={loading}>
          {halls.length === 0 ? (
            <tr><td colSpan={6}><EmptyState title="No subscriptions" description="Halls will appear here once created." /></td></tr>
          ) : halls.map((hall) => {
            const sub = hall.hall_subscriptions?.[0];
            const days = sub?.end_date ? daysLeft(sub.end_date) : null;
            return (
              <tr key={hall.id} className="table-row">
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ fontWeight: 500 }}>{hall.hall_name}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{hall.city}</div>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  {sub ? <span className="badge badge-accent">{sub.packages?.name}</span> : <span style={{ color: "var(--text-muted)" }}>—</span>}
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {sub ? (
                    <>
                      <div>{new Date(sub.start_date).toLocaleDateString()}</div>
                      <div style={{ color: "var(--text-muted)" }}>→ {new Date(sub.end_date).toLocaleDateString()}</div>
                    </>
                  ) : "—"}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  {days !== null ? (
                    <span className={`badge ${days > 7 ? "badge-success" : days > 0 ? "badge-warning" : "badge-danger"}`}>
                      {days > 0 ? `${days}d left` : "Expired"}
                    </span>
                  ) : "—"}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  {sub && (
                    <span className={`badge ${sub.payment_status === "paid" ? "badge-success" : "badge-warning"}`}>
                      {sub.payment_status}
                    </span>
                  )}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.375rem" }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setRenewModal(hall); setMonths(1); }}>
                      Renew
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setChangeModal(hall); setNewPkgId(sub?.package_id || ""); }}>
                      Change plan
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </div>

      {/* Renew modal */}
      <Modal open={!!renewModal} onClose={() => setRenewModal(null)} title={`Renew — ${renewModal?.hall_name}`}>
        <form onSubmit={handleRenew} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <FormField label="Extend by (months)">
            <input className="input" type="number" min="1" max="24" value={months} onChange={e => setMonths(Number(e.target.value))} required />
          </FormField>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setRenewModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving && <span className="spinner" style={{ borderColor: "rgba(255,255,255,0.4)", borderTopColor: "white" }} />}
              {saving ? "Renewing…" : `Renew ${months} month(s)`}
            </button>
          </div>
        </form>
      </Modal>

      {/* Change package modal */}
      <Modal open={!!changeModal} onClose={() => setChangeModal(null)} title={`Change Plan — ${changeModal?.hall_name}`}>
        <form onSubmit={handleChangePackage} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <FormField label="New package">
            <select className="input" value={newPkgId} onChange={e => setNewPkgId(e.target.value)} required>
              <option value="">Select a package…</option>
              {packages.map(p => (
                <option key={p.id} value={p.id}>{p.name} — ₹{p.price}/{p.billing_cycle}</option>
              ))}
            </select>
          </FormField>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setChangeModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving && <span className="spinner" style={{ borderColor: "rgba(255,255,255,0.4)", borderTopColor: "white" }} />}
              {saving ? "Saving…" : "Change package"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
