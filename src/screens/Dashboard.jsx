import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { formatToNaira } from "../utils/formatters";
import ActivationModal from "../components/ActivationModal";
import CTAButton from "../components/CTAButton";

export default function Dashboard() {
  const { userProfile, logout } = useAuth();
  const [isModalMounted, setIsModalMounted] = useState(false);

  // Catch initialization timing delays smoothly
  if (!userProfile) {
    return (
      <div className="velora-canvas" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="velora-spinner" />
      </div>
    );
  }

  return (
    <div className="velora-canvas" style={{ padding: "30px 20px", display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }}>
      
      {/* Top Private Dashboard Management Nav */}
      <div style={{ width: "100%", maxWidth: "1000px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-dark-card)", padding: "16px 24px", borderRadius: "12px" }} className="neon-border-glow">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: userProfile.isActivated ? "#10B981" : "#F59E0B" }} />
          <span style={{ color: "var(--text-white)", fontWeight: "600", fontSize: "15px" }}>
            Welcome, {userProfile.fullName} ({userProfile.username})
          </span>
        </div>
        <button 
          onClick={logout}
          style={{ background: "transparent", border: "1px solid var(--neon-violet)", color: "var(--text-white)", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
        >
          Sign Out
        </button>
      </div>

      {/* Balance Asset Ledger Card Display */}
      <div className="gold-border-frame" style={{ width: "100%", maxWidth: "1000px", background: "var(--bg-dark-card)", borderRadius: "16px", padding: "40px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
        <div>
          <p style={{ textTransform: "uppercase", fontSize: "12px", tracking: "1px", color: "var(--text-slate)", opacity: 0.8, marginBottom: "8px" }}>
            Available Withdrawal Balance ({userProfile.packagePlan} Package)
          </p>
          <h3 style={{ fontSize: "38px", fontWeight: "800", color: "var(--text-white)" }}>
            {formatToNaira(userProfile.balance)}
          </h3>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button 
            onClick={() => setIsModalMounted(true)}
            className="premium-pulse-button"
            style={{ padding: "16px 32px", borderRadius: "8px", fontSize: "15px" }}
          >
            WITHDRAW BALANCE
          </button>
        </div>
      </div>

      {/* Internal Continuous Funnel Promotion Feed Container */}
      <div style={{ width: "100%", maxWidth: "1000px", background: "var(--bg-dark-card)", borderRadius: "12px", padding: "28px", textAlign: "center" }} className="neon-border-glow">
        <h4 style={{ color: "var(--text-white)", marginBottom: "12px", fontSize: "16px", fontWeight: "700" }}> Accelerate Your Velora Commission Funnel</h4>
        <p style={{ color: "var(--text-slate)", fontSize: "14px", marginBottom: "20px", maxWidth: "600px", marginInline: "auto" }}>
          Gain complete community insights, premium copy templates, and daily execution advice inside the central hub. Unrestricted entry parameters apply.
        </p>
        <CTAButton />
      </div>

      {/* Conditional Portal Modal Lock Gate */}
      {isModalMounted && <ActivationModal onClose={() => setIsModalMounted(false)} />}
    </div>
  );
}
