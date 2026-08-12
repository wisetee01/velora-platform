import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { formatToNaira } from "../utils/formatters";
import ActivationModal from "../components/ActivationModal";
import CTAButton from "../components/CTAButton";
import TestimonialPopup from "../components/TestimonialPopup";

export default function Dashboard({ forceOpenActivation, onClearForceOpen }) {
  const { userProfile, logout, isLoading } = useAuth();
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const hasTriggeredAutoOpen = useRef(false);

  // Automatically pop the modal open upon fresh registration redirection overrides
  useEffect(() => {
    if (forceOpenActivation && !hasTriggeredAutoOpen.current) {
      hasTriggeredAutoOpen.current = true;
      setIsActivationModalOpen(true);
      if (onClearForceOpen) {
        onClearForceOpen();
      }
    }
  }, [forceOpenActivation, onClearForceOpen]);

  // ⬇️ RIGID SAFETY SHIELD: If data is loading or missing on fresh login, hold view cleanly ⬇️
  if (isLoading || !userProfile) {
    return (
      <div className="velora-canvas" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0b0518" }}>
        <div className="velora-spinner" style={{ width: "40px", height: "40px", border: "4px solid rgba(139, 92, 246, 0.1)", borderTopColor: "var(--gold-accent, #daa520)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // Read data values directly from your real database profile block
  const isAccountVerified = userProfile.isVerified === true;

  return (
    <div className="velora-canvas" style={{ padding: "30px 20px", display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }}>
      
      {/* PERSISTENT ACTIVATION ALERT BANNER */}
      {!isAccountVerified && (
        <div 
          className="neon-border-glow" 
          style={{ 
            background: "rgba(218, 165, 32, 0.1)", 
            border: "1px solid var(--gold-accent, #daa520)", 
            borderRadius: "12px", 
            padding: "20px", 
            width: "100%",
            maxWidth: "1000px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px"
          }}
        >
          <div style={{ flex: "1", minWidth: "280px" }}>
            <h4 style={{ margin: 0, color: "var(--gold-accent, #daa520)", fontSize: "16px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
              ⚠️ ACTION REQUIRED: ACCOUNT UNVERIFIED
            </h4>
            <p style={{ margin: "6px 0 0 0", color: "var(--text-slate, #8b949e)", fontSize: "13px", lineHeight: "1.5" }}>
              Your daily task wallet is locked. Deposit your verification fee to your assigned merchant account to instantly unlock your payouts.
            </p>
          </div>

          <button
            type="button"
            className="premium-pulse-button"
            onClick={() => setIsActivationModalOpen(true)}
            style={{ 
              padding: "12px 24px", 
              borderRadius: "6px", 
              background: "var(--gold-accent, #daa520)", 
              border: "none", 
              color: "#110922", 
              fontWeight: "700", 
              fontSize: "13px", 
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            ACTIVATE ACCOUNT NOW
          </button>
        </div>
      )}

      {/* Top Private Dashboard Management Nav */}
      <div style={{ width: "100%", maxWidth: "1000px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-dark-card)", padding: "16px 24px", borderRadius: "12px" }} className="neon-border-glow">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: isAccountVerified ? "#10B981" : "#F59E0B" }} />
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
            Available Withdrawal Balance ({userProfile.packagePlan || "Platinum"} Package)
          </p>
          <h3 style={{ fontSize: "38px", fontWeight: "800", color: "var(--text-white)" }}>
            {formatToNaira(userProfile.balance || 0)}
          </h3>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button 
            onClick={() => setIsActivationModalOpen(true)}
            className="premium-pulse-button"
            style={{ padding: "16px 32px", borderRadius: "8px", fontSize: "15px" }}
          >
            ACTIVATE ACCOUNT
          </button>
        </div>
      </div>

      {/* VISUAL FLYER CARD 1 */}
      <div style={{ width: "100%", maxWidth: "1000px", background: "var(--bg-dark-card)", borderRadius: "12px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }} className="neon-border-glow">
        <div style={{ width: "100%", maxWidth: "500px", height: "250px", borderRadius: "8px", overflow: "hidden", background: "#1a102f", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/flyer-whatsapp.png" alt="WhatsApp Task Flyer" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <h4 style={{ color: "var(--text-white)", margin: 0, fontSize: "18px", fontWeight: "700" }}> Welcome to VELORA PLATFORM  💜</h4>
        <p style={{ color: "var(--text-slate)", fontSize: "14px", margin: 0, maxWidth: "600px", textAlign: "center" }}>
         Success doesn't come from waiting for the perfect moment, it comes from taking action today. Stay consistent, stay focused, and keep believing in your journey. Your next breakthrough could be one decision away.
        </p>
        <CTAButton />
      </div>

      {/* VISUAL FLYER CARD 2 */}
      <div style={{ width: "100%", maxWidth: "1000px", background: "var(--bg-dark-card)", borderRadius: "12px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }} className="neon-border-glow">
        <div style={{ width: "100%", maxWidth: "500px", height: "250px", borderRadius: "8px", overflow: "hidden", background: "#1a102f", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/flyer-loan.png" alt="Commission Funnel Flyer" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <h4 style={{ color: "var(--text-white)", margin: 0, fontSize: "18px", fontWeight: "700" }}> Accelerate Your Velora Commission Funnel</h4>
        <p style={{ color: "var(--text-slate)", fontSize: "14px", margin: 0, maxWidth: "600px", textAlign: "center" }}>
          Gain complete community insights, premium copy templates, and daily execution advice inside the central hub. Unrestricted entry parameters apply.
        </p>
        <CTAButton />
      </div>

      {isActivationModalOpen && (
        <ActivationModal onClose={() => setIsActivationModalOpen(false)} />
      )}

      <TestimonialPopup />
    </div>
  ); 
}







