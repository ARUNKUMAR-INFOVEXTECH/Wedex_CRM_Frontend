"use client";
import { useEffect, useState } from "react";
import { packageApi } from "@/lib/api";
import { PageHeader, Modal, FormField, EmptyState } from "@/components/layout/sidebar";
import toast from "react-hot-toast";

const defaultForm = { name: "", price: "", billing_cycle: "monthly", max_users: "", max_bookings: "", features: "" };

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    packageApi.getAll().then(r => setPackages(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(defaultForm); setModalOpen(true); };
  const openEdit = (pkg: any) => {
    setEditing(pkg);
    setForm({
      name: pkg.name, price: pkg.price, billing_cycle: pkg.billing_cycle,
      max_users: pkg.max_users ?? "", max_bookings: pkg.max_bookings ?? "",
      features: Array.isArray(pkg.features) ? pkg.features.join(", ") : (pkg.features || ""),
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      max_users: form.max_users ? Number(form.max_users) : null,
      max_bookings: form.max_bookings ? Number(form.max_bookings) : null,
      features: form.features ? form.features.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    };
    try {
      if (editing) { await packageApi.update(editing.id, payload); toast.success("Package updated"); }
      else { await packageApi.create(payload); toast.success("Package created"); }
      setModalOpen(false); load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await packageApi.delete(id); toast.success("Deleted"); load();
    } catch (err: any) { toast.error(err?.response?.data?.message || "Cannot delete"); }
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Packages"
        subtitle="Define subscription plans for hall owners"
        action={<button className="btn btn-primary" onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Package
        </button>}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}><div className="spinner" style={{ display: "inline-block", width: 28, height: 28, borderWidth: 3 }} /></div>
      ) : packages.length === 0 ? (
        <EmptyState title="No packages yet" description="Create your first subscription package." action={<button className="btn btn-primary" onClick={openCreate}>Create Package</button>} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {packages.map((pkg) => (
            <div key={pkg.id} className="card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: "1.0625rem", marginBottom: "0.25rem" }}>{pkg.name}</h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                    <span style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--accent)" }}>
                      ₹{Number(pkg.price).toLocaleString()}
                    </span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>/{pkg.billing_cycle}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.375rem" }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(pkg)} title="Edit">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(pkg.id, pkg.name)} title="Delete">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", padding: "0.625rem 0.75rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 2 }}>Max users</div>
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>{pkg.max_users ?? "∞"}</div>
                </div>
                <div style={{ flex: 1, background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", padding: "0.625rem 0.75rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 2 }}>Max bookings</div>
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>{pkg.max_bookings ?? "∞"}</div>
                </div>
              </div>

              {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.375rem", margin: 0, paddingLeft: 0, listStyle: "none" }}>
                  {pkg.features.map((f: string) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Package" : "New Package"}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <FormField label="Package name *">
            <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Basic / Pro / Enterprise" />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Price (₹) *">
              <input className="input" type="number" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required placeholder="999" />
            </FormField>
            <FormField label="Billing cycle">
              <select className="input" value={form.billing_cycle} onChange={e => setForm(p => ({ ...p, billing_cycle: e.target.value }))}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </FormField>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormField label="Max users" hint="Leave blank for unlimited">
              <input className="input" type="number" min="1" value={form.max_users} onChange={e => setForm(p => ({ ...p, max_users: e.target.value }))} placeholder="Unlimited" />
            </FormField>
            <FormField label="Max bookings" hint="Leave blank for unlimited">
              <input className="input" type="number" min="1" value={form.max_bookings} onChange={e => setForm(p => ({ ...p, max_bookings: e.target.value }))} placeholder="Unlimited" />
            </FormField>
          </div>
          <FormField label="Features" hint="Comma-separated list of features">
            <input className="input" value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} placeholder="Booking management, SMS alerts, Reports" />
          </FormField>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving && <span className="spinner" style={{ borderColor: "rgba(255,255,255,0.4)", borderTopColor: "white" }} />}
              {saving ? "Saving…" : editing ? "Save changes" : "Create package"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
