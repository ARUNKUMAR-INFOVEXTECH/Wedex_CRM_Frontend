"use client";
import { useEffect, useState } from "react";
import { staffApi } from "@/lib/api";
import { PageHeader, Modal, FormField, EmptyState, Table } from "@/components/layout/sidebar";
import { useAuth } from "@/lib/auth-context";
import toast from "react-hot-toast";

export default function OwnerStaffPage() {
  const { user } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff" });
  const [editRole, setEditRole] = useState("staff");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    staffApi.getAll().then(r => setStaff(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await staffApi.create(form);
      toast.success(`Staff created. A confirmation email has been sent to ${form.email}`);
      setCreateOpen(false);
      setForm({ name: "", email: "", password: "", role: "staff" });
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create staff");
    } finally { setSaving(false); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await staffApi.update(editStaff.id, editRole);
      toast.success("Role updated");
      setEditStaff(null);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from your hall?`)) return;
    try {
      await staffApi.delete(id);
      toast.success("Staff removed");
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    }
  };

  const filtered = staff.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.role?.toLowerCase().includes(search.toLowerCase())
  );

  const managers = staff.filter(s => s.role === "manager").length;
  const staffOnly = staff.filter(s => s.role === "staff").length;

  return (
    <div className="page-enter">
      <PageHeader
        title="Staff"
        subtitle={`${staff.length} member${staff.length !== 1 ? "s" : ""} · ${managers} manager${managers !== 1 ? "s" : ""} · ${staffOnly} staff`}
        action={
          <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Staff
          </button>
        }
      />

      {/* Search */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ position: "relative", maxWidth: 320 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="input" placeholder="Search staff…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "2.25rem" }} />
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <Table headers={["Member", "Email", "Role", "Joined", "Actions"]} loading={loading}>
          {filtered.length === 0 ? (
            <tr><td colSpan={5}>
              <EmptyState
                title="No staff members"
                description="Add your first staff member to get started."
                action={<button className="btn btn-primary" onClick={() => setCreateOpen(true)}>Add Staff Member</button>}
              />
            </td></tr>
          ) : filtered.map((s) => (
            <tr key={s.id} className="table-row">
              <td style={{ padding: "1rem 1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: s.role === "manager" ? "var(--accent-light)" : "var(--bg-subtle)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: s.role === "manager" ? "var(--accent)" : "var(--text-muted)",
                    fontWeight: 600, fontSize: "0.875rem", flexShrink: 0,
                  }}>
                    {s.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{s.name}</div>
                    {s.role === "owner" && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Hall owner</div>}
                  </div>
                </div>
              </td>
              <td style={{ padding: "1rem 1.25rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>{s.email}</td>
              <td style={{ padding: "1rem 1.25rem" }}>
                <span className={`badge ${s.role === "owner" ? "badge-accent" : s.role === "manager" ? "badge-success" : "badge-neutral"}`}>
                  {s.role}
                </span>
              </td>
              <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                {new Date(s.created_at).toLocaleDateString()}
              </td>
              <td style={{ padding: "1rem 1.25rem" }}>
                {s.role !== "owner" && (
                  <div style={{ display: "flex", gap: "0.375rem" }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => { setEditStaff(s); setEditRole(s.role); }}
                    >
                      Edit role
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(s.id, s.name)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Staff Member">
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <FormField label="Full name *">
            <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Jane Doe" />
          </FormField>
          <FormField label="Email address *">
            <input className="input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="jane@example.com" />
          </FormField>
          <FormField label="Password *" hint="A confirmation email will be sent to this address">
            <input className="input" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required placeholder="Min. 8 characters" />
          </FormField>
          <FormField label="Role">
            <select className="input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          </FormField>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving && <span className="spinner" style={{ borderColor: "rgba(255,255,255,0.4)", borderTopColor: "white" }} />}
              {saving ? "Creating…" : "Add Staff Member"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit role modal */}
      <Modal open={!!editStaff} onClose={() => setEditStaff(null)} title={`Edit Role — ${editStaff?.name}`}>
        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <FormField label="Role">
            <select className="input" value={editRole} onChange={e => setEditRole(e.target.value)}>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          </FormField>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setEditStaff(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving && <span className="spinner" style={{ borderColor: "rgba(255,255,255,0.4)", borderTopColor: "white" }} />}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
