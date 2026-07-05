import { formatToNaira } from "../utils/formatters";

/**
 * Gold-accented promotional tier pricing element wrapper.
 */
export default function PackageCard({ planType, cost, initialBalance, features, onSelectPlan }) {
  const containerStyle = {
    background: "var(--bg-dark-card)",
    padding: "32px 24px",
    borderRadius: "16px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "450px"
  };

  const listStyle = {
    listStyle: "none",
    margin: "24px 0",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    textAlign: "left",
    flexGrow: 1
  };

  const isPlatinum = planType.toLowerCase() === "platinum";

  return (
    <div className={isPlatinum ? "gold-border-frame" : "neon-border-glow"} style={containerStyle}>
      <h3 style={{ textTransform: "uppercase", fontSize: "20px", fontWeight: "700", color: "var(--text-white)", letterSpacing: "1px" }}>
        Velora {planType}
      </h3>
      
      <div style={{ margin: "20px 0 10px 0" }}>
        <span style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-white)" }}>
          {formatToNaira(cost)}
        </span>
      </div>

      <p style={{ fontSize: "13px", color: "var(--neon-violet-glow)" }}>
        Instant Welcome Balance: {formatToNaira(initialBalance)}
      </p>

      <ul style={listStyle}>
        {features.map((featureItem, index) => (
          <li key={index} style={{ fontSize: "14px", color: "var(--text-slate)", display: "flex", gap: "8px" }}>
            <span style={{ color: "var(--gold-accent)" }}>✓</span> {featureItem}
          </li>
        ))}
      </ul>

      <button 
        className="premium-pulse-button" 
        style={{ padding: "14px 20px", width: "100%", borderRadius: "8px" }}
        onClick={() => onSelectPlan(planType.toLowerCase())}
      >
        Select {planType} Plan
      </button>
    </div>
  );
}
