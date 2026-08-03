export default function AuthScreen() {
  return (
    <div className="velora-canvas" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", padding: "20px" }}>
      <div className="neon-border-glow" style={{ background: "var(--bg-dark-card)", maxWidth: "440px", width: "100%", padding: "36px 28px", borderRadius: "16px", textAlign: "center" }}>
        <h2 style={{ color: "var(--text-white)", fontSize: "22px", fontWeight: "800", marginBottom: "12px" }}>PORTAL LOCKED</h2>
        <p style={{ color: "var(--text-slate)", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>
          The registration and login portals are temporarily suspended due to core scheduled maintenance. Please return once the main network notice updates.
        </p>
      </div>
    </div>
  );
}

