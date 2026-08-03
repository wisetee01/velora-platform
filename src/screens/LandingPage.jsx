import CTAButton from "../components/CTAButton";

export default function LandingPage() {
  return (
    <div className="velora-canvas" style={{ padding: "40px 20px", display: "flex", flexDirection: "column", minHeight: "100vh", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <header style={{ width: "100%", maxWidth: "1200px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "40px" }}>
        <h1 className="gold-text-accent" style={{ fontSize: "36px", fontWeight: "900", letterSpacing: "2px", margin: 0 }}>VELORA</h1>
      </header>

      <section style={{ maxWidth: "600px", background: "var(--bg-dark-card)", padding: "40px 32px", borderRadius: "16px", border: "1px solid var(--neon-violet)" }} className="neon-border-glow">
        <div style={{ fontSize: "50px", marginBottom: "20px" }}>🛠️</div>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-white)", marginBottom: "16px" }}>SYSTEM MAINTENANCE</h2>
        <p style={{ color: "var(--text-slate)", fontSize: "15px", lineHeight: "1.6", marginBottom: "0px" }}>
          We are currently upgrading our wallet distribution networks and core task engines to serve you better. The Velora platform will be open for normal earnings shortly. Thank you for your patience! 💜
        </p>
      </section>

      <footer style={{ marginTop: "60px", opacity: 0.4 }}>
        <p style={{ fontSize: "12px", color: "var(--text-slate)" }}>© 2026 Velora Platform. All structural systems paused.</p>
      </footer>
    </div>
  );
}
