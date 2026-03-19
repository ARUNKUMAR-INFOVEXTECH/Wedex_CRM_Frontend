"use client";
import { useEffect, useState } from "react";
import { adminApi, packageApi } from "@/lib/api";
import { PageHeader, Modal, FormField, EmptyState, Table } from "@/components/layout/sidebar";
import toast from "react-hot-toast";

export default function HallsPage() {
  const [halls, setHalls] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    hall_name: "", owner_name: "", owner_email: "", password: "",
    phone: "", city: "", address: "", package_id: "",
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.getHalls(), packageApi.getAll()])
      .then(([h, p]) => { setHalls(h.data); setPackages(p.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createHall(form);
      toast.success("Hall created successfully!");
      setCreateOpen(false);
      setForm({ hall_name: "", owner_name: "", owner_email: "", password: "", phone: "", city: "", address: "", package_id: "" });
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create hall");
    } finally { setSaving(false); }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm("Suspend this hall?")) return;
    await adminApi.suspendHall(id);
    toast.success("Hall suspended");
    load();
  };

  const handleActivate = async (id: string) => {
    await adminApi.activateHall(id);
    toast.success("Hall activated");
    load();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await adminApi.deleteHall(id);
    toast.success("Hall deleted");
    load();
  };

  const filtered = halls.filter(h =>
    h.hall_name?.toLowerCase().includes(search.toLowerCase()) ||
    h.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
    h.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter">
      <PageHeader
        title="Halls"
        subtitle={`${halls.length} hall${halls.length !== 1 ? "s" : ""} registered`}
        action={
          <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Hall
          </button>
        }
      />

      {/* Search */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ position: "relative", maxWidth: 320 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="input" placeholder="Search halls…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "2.25rem" }} />
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <Table headers={["Hall", "Owner", "City", "Phone", "Status", "Subscription", "Actions"]} loading={loading}>
          {filtered.length === 0 ? (
            <tr><td colSpan={7}><EmptyState title="No halls found" description="Create your first hall to get started." /></td></tr>
          ) : filtered.map((hall) => {
            const sub = hall.hall_subscriptions?.[0];
            return (
              <tr key={hall.id} className="table-row">
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ fontWeight: 500 }}>{hall.hall_name}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{hall.email}</div>
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>{hall.owner_name}</td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>{hall.city || "—"}</td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>{hall.phone || "—"}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span className={`badge ${hall.status === "active" ? "badge-success" : "badge-warning"}`}>{hall.status}</span>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  {sub ? (
                    <div>
                      <span className={`badge ${sub.status === "active" ? "badge-accent" : "badge-neutral"}`}>{sub.packages?.name}</span>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 3 }}>
                        {sub.payment_status === "paid" ? "✓ Paid" : "⏳ Pending"}
                      </div>
                    </div>
                  ) : <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>None</span>}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
                    {hall.status === "active" ? (
                      <button className="btn btn-sm" style={{ background: "var(--warning-light)", color: "var(--warning)", border: "1px solid #fde68a" }} onClick={() => handleSuspend(hall.id)}>
                        Suspend
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-secondary" onClick={() => handleActivate(hall.id)}>
                        Activate
                      </button>
                    )}
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(hall.id, hall.hall_name)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Hall">
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Hall name *">
              <input className="input" value={form.hall_name} onChange={e => setForm(p => ({ ...p, hall_name: e.target.value }))} required placeholder="Grand Palace Hall" />
            </FormField>
            <FormField label="Owner name *">
              <input className="input" value={form.owner_name} onChange={e => setForm(p => ({ ...p, owner_name: e.target.value }))} required placeholder="John Smith" />
            </FormField>
          </div>
          <FormField label="Owner email *">
            <input className="input" type="email" value={form.owner_email} onChange={e => setForm(p => ({ ...p, owner_email: e.target.value }))} required placeholder="owner@example.com" />
          </FormField>
          <FormField label="Password *" hint="A confirmation email will be sent to the owner">
            <input className="input" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required placeholder="Min. 8 characters" />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Phone">
              <input className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
            </FormField>
            <FormField label="City">
              <input className="input" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Chennai" />
            </FormField>
          </div>
          <FormField label="Address">
            <input className="input" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="123 Main Street" />
          </FormField>
          <FormField label="Package *">
            <select className="input" value={form.package_id} onChange={e => setForm(p => ({ ...p, package_id: e.target.value }))} required>
              <option value="">Select a package…</option>
              {packages.map(p => (
                <option key={p.id} value={p.id}>{p.name} — ₹{p.price}/{p.billing_cycle}</option>
              ))}
            </select>
          </FormField>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving && <span className="spinner" style={{ borderColor: "rgba(255,255,255,0.4)", borderTopColor: "white" }} />}
              {saving ? "Creating…" : "Create Hall"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
