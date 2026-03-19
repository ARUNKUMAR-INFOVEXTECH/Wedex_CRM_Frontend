"use client";
import { SidebarLayout } from "@/components/layout/sidebar";

const navItems = [
  {
    label: "Dashboard",
    href: "/owner",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    label: "Staff",
    href: "/owner/staff",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    label: "Subscription",
    href: "/owner/subscription",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout navItems={navItems} title="Hall Owner" subtitle="Owner Portal">
      <div style={{ padding: "2rem 2.5rem" }}>
        {children}
      </div>
    </SidebarLayout>
  );
}
