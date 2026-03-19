"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { clsx } from "clsx";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
  subtitle?: string;
}

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export function SidebarLayout({ children, navItems, title, subtitle }: SidebarLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 20,
      }}>
        {/* Logo */}
        <div style={{
          padding: "1.25rem 1.25rem 1rem",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{
              width: 32, height: 32,
              background: "var(--accent)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9375rem", letterSpacing: "-0.01em", color: "var(--text-primary)" }}>
                HallFlow
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: -1 }}>
                {subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0.75rem 0.75rem", display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em", color: "var(--text-muted)", textTransform: "uppercase", padding: "0.5rem 0.875rem 0.25rem" }}>
            {title}
          </p>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx("nav-item", active && "active")}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{
          padding: "0.875rem 1rem",
          borderTop: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--accent-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--accent)", fontWeight: 600, fontSize: "0.8125rem",
              flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text-primary)" }}>
                {user?.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.role?.replace("_", " ")}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn btn-ghost"
            style={{ width: "100%", justifyContent: "flex-start", fontSize: "0.8125rem", padding: "0.4rem 0.625rem", gap: "0.5rem" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 240, minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      marginBottom: "1.75rem", gap: "1rem",
    }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.025em", color: "var(--text-primary)" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon, color = "accent", change }: {
  label: string; value: string | number; icon: React.ReactNode;
  color?: "accent" | "success" | "warning" | "danger"; change?: string;
}) {
  const colors = {
    accent: { bg: "var(--accent-light)", color: "var(--accent)" },
    success: { bg: "var(--success-light)", color: "var(--success)" },
    warning: { bg: "var(--warning-light)", color: "var(--warning)" },
    danger: { bg: "var(--danger-light)", color: "var(--danger)" },
  };
  const c = colors[color];

  return (
    <div className="stat-card">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: 10,
          background: c.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: c.color,
        }}>
          {icon}
        </div>
        {change && (
          <span style={{ fontSize: "0.75rem", color: "var(--success)", background: "var(--success-light)", padding: "2px 8px", borderRadius: 99, fontWeight: 500 }}>
            {change}
          </span>
        )}
      </div>
      <div style={{ fontSize: "1.75rem", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
        {label}
      </div>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <div style={{
        width: 56, height: 56,
        background: "var(--bg-subtle)",
        borderRadius: 14,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        marginBottom: "1rem",
        color: "var(--text-muted)",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
        </svg>
      </div>
      <h3 style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.375rem" }}>{title}</h3>
      {description && <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>{description}</p>}
      {action}
    </div>
  );
}

export function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 1.5rem 0" }}>
          <h2 style={{ fontWeight: 600, fontSize: "1.125rem", color: "var(--text-primary)" }}>{title}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>{children}</div>
      </div>
    </div>
  );
}

export function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>{hint}</p>}
    </div>
  );
}

export function Table({ headers, children, loading }: { headers: string[]; children: React.ReactNode; loading?: boolean }) {
  return (
    <div style={{ overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {headers.map((h) => (
              <th key={h} style={{
                textAlign: "left", padding: "0.75rem 1.25rem",
                fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={headers.length} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><div className="spinner" /></div>
            </td></tr>
          ) : children}
        </tbody>
      </table>
    </div>
  );
}
