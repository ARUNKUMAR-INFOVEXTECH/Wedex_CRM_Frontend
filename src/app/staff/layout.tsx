"use client";
import { SidebarLayout } from "@/components/layout/sidebar";

const navItems = [
  {
    label: "Dashboard",
    href: "/staff",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout navItems={navItems} title="Staff Portal" subtitle="Staff View">
      <div style={{ padding: "2rem 2.5rem" }}>
        {children}
      </div>
    </SidebarLayout>
  );
}
