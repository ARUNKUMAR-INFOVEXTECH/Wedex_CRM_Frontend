import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--bg)", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.125rem 5%", borderBottom: "1px solid var(--border)",
        background: "rgba(250,250,250,0.85)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 30,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ width: 32, height: 32, background: "var(--accent)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.0625rem", letterSpacing: "-0.02em" }}>HallFlow</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/login" className="btn btn-secondary btn-sm">Sign in</Link>
          <Link href="/login" className="btn btn-primary btn-sm">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: "6rem 5% 5rem",
        maxWidth: 1100, margin: "0 auto",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "var(--accent-light)", color: "var(--accent)",
          padding: "0.375rem 0.875rem", borderRadius: 99,
          fontSize: "0.8125rem", fontWeight: 500, marginBottom: "1.75rem",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
          Now available for all marriage halls
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          color: "var(--text-primary)",
          marginBottom: "1.5rem",
          maxWidth: 760, margin: "0 auto 1.5rem",
        }}>
          The complete platform for<br />
          <span style={{ color: "var(--accent)", fontStyle: "italic" }}>marriage hall management</span>
        </h1>

        <p style={{
          fontSize: "1.125rem", color: "var(--text-secondary)", lineHeight: 1.7,
          maxWidth: 520, margin: "0 auto 2.5rem",
        }}>
          Streamline your hall operations with powerful tools for booking management, staff coordination, and subscription billing — all in one place.
        </p>

        <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/login" className="btn btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}>
            Start managing your hall
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <a href="#features" className="btn btn-secondary" style={{ padding: "0.75rem 1.75rem", fontSize: "1rem" }}>
            See features
          </a>
        </div>
      </section>

      {/* Dashboard preview */}
      <section style={{ padding: "0 5% 5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "0 24px 64px -12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}>
          {/* Fake browser bar */}
          <div style={{ background: "var(--bg-subtle)", padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: "0.375rem" }}>
              {["#fc6058","#fdbc40","#35cd4b"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
            </div>
            <div style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "0.25rem 0.75rem", fontSize: "0.78rem", color: "var(--text-muted)", maxWidth: 280, margin: "0 auto" }}>
              app.hallflow.com/admin
            </div>
          </div>
          {/* Fake dashboard content */}
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: 360 }}>
            <div style={{ borderRight: "1px solid var(--border)", padding: "1rem 0.75rem", background: "var(--bg-card)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", marginBottom: "0.5rem" }}>
                <div style={{ width: 24, height: 24, background: "var(--accent)", borderRadius: 6 }} />
                <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>HallFlow</span>
              </div>
              {["Dashboard","Halls","Packages","Subscriptions"].map((item, i) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.75rem", borderRadius: 6, background: i === 0 ? "var(--accent-light)" : "transparent", marginBottom: "2px" }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: i === 0 ? "var(--accent)" : "var(--border-strong)" }} />
                  <span style={{ fontSize: "0.8125rem", color: i === 0 ? "var(--accent)" : "var(--text-muted)", fontWeight: i === 0 ? 500 : 400 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "1.5rem", background: "var(--bg)" }}>
              <div style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.25rem" }}>Dashboard</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.875rem", marginBottom: "1.25rem" }}>
                {[["Total Halls","24","accent"],["Active","20","success"],["Suspended","4","warning"]].map(([l,v,c]) => (
                  <div key={l} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "1rem" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: `var(--${c}-light)`, marginBottom: "0.625rem" }} />
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em" }}>{v}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                Recent halls table
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "5rem 5%", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", letterSpacing: "-0.025em", marginBottom: "0.75rem" }}>
            Everything you need
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>
            Built for hall owners, managers, and administrators who need a reliable, easy-to-use platform.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
          {[
            {
              icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
              title: "Hall management",
              desc: "Create and manage multiple halls. Control status, suspend or activate halls, and track all details in one place.",
            },
            {
              icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M12 3a4 4 0 010 8",
              title: "Staff control",
              desc: "Add managers and staff members with role-based access. Enforce user limits based on your subscription plan.",
            },
            {
              icon: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
              title: "Flexible packages",
              desc: "Design subscription plans with custom pricing, user limits, booking limits, and feature sets.",
            },
            {
              icon: "M1 4h22v16a2 2 0 01-2 2H3a2 2 0 01-2-2V4z M1 10h22",
              title: "Subscription billing",
              desc: "Track subscriptions, renew plans, switch packages, and monitor payment status across all halls.",
            },
            {
              icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
              title: "Role-based access",
              desc: "Super admin, hall owner, manager, and staff roles with fine-grained permission controls.",
            },
            {
              icon: "M22 12h-4l-3 9L9 3l-3 9H2",
              title: "Real-time status",
              desc: "Live status updates for halls and subscriptions. Instant feedback on every action you take.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card" style={{ padding: "1.5rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", color: "var(--accent)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                  <path d={icon} />
                </svg>
              </div>
              <h3 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "0.5rem" }}>{title}</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles section */}
      <section style={{ padding: "5rem 5%", background: "var(--text-primary)", margin: "0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", color: "white", letterSpacing: "-0.025em", marginBottom: "0.75rem" }}>
              Built for every role
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 420, margin: "0 auto" }}>
              Different views and permissions for every member of your team.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {[
              { role: "Super Admin", color: "#a78bfa", desc: "Full control over all halls, packages, and subscriptions. Create halls, assign plans, and monitor everything." },
              { role: "Hall Owner", color: "#34d399", desc: "Manage your hall's staff, view your subscription details, and keep track of your team members." },
              { role: "Staff / Manager", color: "#60a5fa", desc: "Access your assigned hall with role-appropriate permissions. Managers get extended capabilities." },
            ].map(({ role, color, desc }) => (
              <div key={role} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-lg)", padding: "1.75rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${color}22`, color, padding: "0.25rem 0.875rem", borderRadius: 99, fontSize: "0.8125rem", fontWeight: 600, marginBottom: "1rem" }}>
                  {role}
                </div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "6rem 5%", textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", letterSpacing: "-0.025em", marginBottom: "1rem" }}>
          Ready to streamline your hall?
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "2rem", lineHeight: 1.7 }}>
          Sign in to your account or contact your administrator to get access.
        </p>
        <Link href="/login" className="btn btn-primary" style={{ padding: "0.875rem 2.5rem", fontSize: "1.0625rem" }}>
          Sign in to HallFlow
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "1.5rem 5%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 24, height: 24, background: "var(--accent)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>HallFlow</span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
          © {new Date().getFullYear()} HallFlow. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
