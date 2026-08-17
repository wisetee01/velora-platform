import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { formatToNaira } from "../utils/formatters";
import ActivationModal from "../components/ActivationModal";
import CTAButton from "../components/CTAButton";
import TestimonialPopup from "../components/TestimonialPopup";
import { requestPlatformLoan, subscribeToUserLoans } from "../api/loans";


export default function Dashboard({ onNavigate, forceOpenActivation, onClearForceOpen }) {
  const {currentUser, userProfile, logout } = useAuth();
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const hasTriggeredAutoOpen = useRef(false);

  useEffect(() => {
    if (forceOpenActivation && !hasTriggeredAutoOpen.current) {
      hasTriggeredAutoOpen.current = true;
      setIsActivationModalOpen(true);
      if (onClearForceOpen) onClearForceOpen();
    }
  }, [forceOpenActivation, onClearForceOpen]);


    const [loanAmount, setLoanAmount] = useState("");
  const [loanHistory, setLoanHistory] = useState([]);
  const [loanStatus, setLoanStatus] = useState({ type: "", text: "" });
  const [isLoanProcessing, setIsLoanProcessing] = useState(false);

  // Attaches the real-time background tracker for the user's loans
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsubscribeLoans = subscribeToUserLoans(currentUser.uid, (dataList) => {
      setLoanHistory(dataList);
    });
    return () => unsubscribeLoans();
  }, [currentUser]);

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    if (!loanAmount) return setLoanStatus({ type: "error", text: "Please enter a valid loan request amount value." });
    
    setIsLoanProcessing(true);
    setLoanStatus({ type: "", text: "" });

    try {
      const activeBalance = userProfile.balance !== undefined ? userProfile.balance : (userProfile.packagePlan === "gold" ? 50750 : 31500);
      const unifiedContext = { ...userProfile, balance: activeBalance };

      await requestPlatformLoan(currentUser.uid, unifiedContext, loanAmount);
      setLoanStatus({ type: "success", text: "Application Successful! Your loan ticket is pending admin validation." });
      setLoanAmount("");
    } catch (err) {
      setLoanStatus({ type: "error", text: err.message });
    } finally {
      setIsLoanProcessing(false);
    }
  };


  if (!userProfile) {
    return (
      <div className="velora-canvas" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0b0518" }}>
        <div className="velora-spinner" style={{ width: "40px", height: "40px", border: "4px solid rgba(139, 92, 246, 0.1)", borderTopColor: "var(--gold-accent, #daa520)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const isAccountVerified = (userProfile.isVerified ?? userProfile.isActivated) === true;
  const displayWalletFunds = userProfile.balance !== undefined ? userProfile.balance : (userProfile.packagePlan === "gold" ? 50750 : 31500);


  return (
    <div className="velora-canvas" style={{ padding: "30px 20px", display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }}>
      
      {/* ⬇️ INJECTED HIDDEN ADMIN BANNER: Visible ONLY to accounts flagged with isAdmin: true ⬇️ */}
      {userProfile.isAdmin === true && (
        <div className="gold-border-frame" style={{ width: "100%", maxWidth: "1000px", background: "rgba(218, 165, 32, 0.08)", padding: "12px 24px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--gold-accent)" }}>
          <span style={{ color: "var(--gold-accent)", fontSize: "13px", fontWeight: "800" }}>👑 ADMINISTRATOR MODE DETECTED: OPEN CONTROLS</span>
          <button type="button" onClick={() => onNavigate("ADMIN_PANEL")} className="premium-pulse-button" style={{ padding: "8px 16px", borderRadius: "6px", background: "var(--gold-accent)", border: "none", color: "#110922", fontWeight: "700", fontSize: "12px" }}>LAUNCH ADMIN COMMANDS</button>
        </div>
      )}

      {/* PERSISTENT ACTIVATION ALERT BANNER */}
      {!isAccountVerified && (
        <div className="neon-border-glow" style={{ background: "rgba(218, 165, 32, 0.1)", border: "1px solid var(--gold-accent, #daa520)", borderRadius: "12px", padding: "20px", width: "100%", maxWidth: "1000px", display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <h4 style={{ margin: 0, color: "var(--gold-accent, #daa520)", fontSize: "16px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>⚠️ ACTION REQUIRED: ACCOUNT UNVERIFIED</h4>
            <p style={{ margin: "6px 0 0 0", color: "var(--text-slate, #8b949e)", fontSize: "13px", lineHeight: "1.5" }}>Your daily task wallet is locked. Deposit your verification fee to your assigned merchant account to instantly unlock your payouts.</p>
          </div>
          <button type="button" className="premium-pulse-button" onClick={() => setIsActivationModalOpen(true)} style={{ padding: "12px 24px", borderRadius: "6px", background: "var(--gold-accent, #daa520)", border: "none", color: "#110922", fontWeight: "700", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" }}>ACTIVATE ACCOUNT NOW</button>
        </div>
      )}

      {/* Top Private Dashboard Management Nav */}
      <div style={{ width: "100%", maxWidth: "1000px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-dark-card)", padding: "16px 24px", borderRadius: "12px" }} className="neon-border-glow">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: isAccountVerified ? "#10B981" : "#F59E0B" }} />
          <span style={{ color: "var(--text-white)", fontWeight: "600", fontSize: "15px" }}>Welcome, {userProfile.fullName} ({userProfile.username})</span>
        </div>
        <button onClick={logout} style={{ background: "transparent", border: "1px solid var(--neon-violet)", color: "var(--text-white)", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>Sign Out</button>
      </div>

      {/* Balance Asset Ledger Card Display */}
      <div className="gold-border-frame" style={{ width: "100%", maxWidth: "1000px", background: "var(--bg-dark-card)", borderRadius: "16px", padding: "40px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
        <div>
          <p style={{ textTransform: "uppercase", fontSize: "12px", tracking: "1px", color: "var(--text-slate)", opacity: 0.8, marginBottom: "8px" }}>Available Withdrawal Balance ({userProfile.packagePlan || "Platinum"} Package)</p>
          <h3 style={{ fontSize: "38px", fontWeight: "800", color: "var(--text-white)" }}>{formatToNaira(displayWalletFunds)}</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => setIsActivationModalOpen(true)} className="premium-pulse-button" style={{ padding: "16px 32px", borderRadius: "8px", fontSize: "15px" }}>ACTIVATE ACCOUNT</button>
        </div>
      </div>

      {/* CORE REVENUE PANEL SHORTCUT ACTIONS */}
      <div style={{ width: "100%", maxWidth: "1000px", display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        <button type="button" onClick={() => onNavigate("VIDEO_TASKS")} className="premium-pulse-button" style={{ flex: "1", minWidth: "260px", padding: "18px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", background: "var(--bg-dark-card)", border: "1px solid var(--gold-accent)", color: "var(--gold-accent)", cursor: "pointer" }}>
           PERFORM DAILY VIDEOS TASKS
        </button>
        <button type="button" onClick={() => onNavigate("WITHDRAW")} className="premium-pulse-button" style={{ flex: "1", minWidth: "260px", padding: "18px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", background: "var(--bg-dark-card)", border: "1px solid var(--neon-violet)", color: "var(--text-white)", cursor: "pointer" }}>
           WITHDRAW DAILY TASK
        </button>
      </div>

            {/* CENTRAL VELORA LOAN CREDIT VAULT PANEL INJECTION */}
      <div className="neon-border-glow" style={{ width: "100%", maxWidth: "1000px", background: "var(--bg-dark-card)", borderRadius: "16px", padding: "32px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
        <div>
          <h3 style={{ color: "var(--text-white)", margin: 0, fontSize: "20px", fontWeight: "800" }}>VELORA LOAN VAULT 🏦</h3>
          <p style={{ color: "var(--text-slate)", fontSize: "13px", marginTop: "4px", lineHeight: "1.5" }}>Apply for micro- Velora loans with zero collateral overhead blocks. Minimum request bounds apply starting from ₦30,000 threshold tiers.</p>
          
          {loanStatus.text && (
            <div style={{ marginTop: "16px", padding: "10px", borderRadius: "6px", fontSize: "12px", background: loanStatus.type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)", border: loanStatus.type === "error" ? "1px solid #EF4444" : "1px solid #10B981", color: loanStatus.type === "error" ? "#EF4444" : "#10B981" }}>{loanStatus.text}</div>
          )}

          <form onSubmit={handleLoanSubmit} style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ fontSize: "11px", color: "var(--text-slate)" }}>Desired Capital Loan Amount (₦30,000 Min)</label>
            <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="e.g. 30000" style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#1a102f", border: "1px solid var(--neon-violet)", color: "#fff", outline: "none" }} />
            <button type="submit" disabled={isLoanProcessing} className="premium-pulse-button" style={{ padding: "12px", borderRadius: "8px", fontWeight: "700" }}>{isLoanProcessing ? "SUBMITTING TICKET..." : "REQUEST CAPITAL LOAN"}</button>
          </form>
        </div>

        {/* Real-time Subscribed Personal Loan Statement List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ margin: 0, color: "var(--text-slate)", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>Your Loan Statements ({loanHistory.length})</h4>
          <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
            {loanHistory.length === 0 ? (
              <p style={{ color: "var(--text-slate)", fontSize: "12px", margin: 0, fontStyle: "italic" }}>No active or pending credit logs logged.</p>
            ) : (
              loanHistory.map((loan) => (
                <div key={loan.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1a102f", padding: "12px 14px", borderRadius: "6px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
                  <div>
                    <span style={{ display: "block", color: "#fff", fontSize: "14px", fontWeight: "700" }}>{formatToNaira(loan.amount)}</span>
                    <span style={{ fontSize: "10px", color: "var(--text-slate)" }}>{loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : "Recent"}</span>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: "800", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", background: loan.status === "pending" ? "rgba(218,165,32,0.1)" : loan.status === "approved" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: loan.status === "pending" ? "var(--gold-accent)" : loan.status === "approved" ? "#10B981" : "#EF4444", border: `1px solid ${loan.status === "pending" ? "rgba(218,165,32,0.2)" : loan.status === "approved" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>{loan.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>


      {/* VISUAL FLYER CARD 1 */}
      <div style={{ width: "100%", maxWidth: "1000px", background: "var(--bg-dark-card)", borderRadius: "12px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }} className="neon-border-glow">
        <div style={{ width: "100%", maxWidth: "500px", height: "250px", borderRadius: "8px", overflow: "hidden", background: "#1a102f", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/flyer-whatsapp.png" alt="WhatsApp Task Flyer" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <h4 style={{ color: "var(--text-white)", margin: 0, fontSize: "18px", fontWeight: "700" }}> Welcome to VELORA PLATFORM </h4>
        <p style={{ color: "var(--text-slate)", fontSize: "14px", margin: 0, maxWidth: "600px", textAlign: "center" }}>Success doesn't come from waiting for the perfect moment, it comes from taking action today. Stay consistent, stay focused, and keep believing in your journey. Your next breakthrough could be one decision away.</p>
        <CTAButton />
      </div>

      {/* VISUAL FLYER CARD 2 */}
      <div style={{ width: "100%", maxWidth: "1000px", background: "var(--bg-dark-card)", borderRadius: "12px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }} className="neon-border-glow">
        <div style={{ width: "100%", maxWidth: "500px", height: "250px", borderRadius: "8px", overflow: "hidden", background: "#1a102f", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/slot.png" alt="Commission Funnel Flyer" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <h4 style={{ color: "var(--text-white)", margin: 0, fontSize: "18px", fontWeight: "700" }}> Accelerate Your Velora Commission Funnel</h4>
        <p style={{ color: "var(--text-slate)", fontSize: "14px", margin: 0, maxWidth: "600px", textAlign: "center" }}>Gain complete community insights, premium copy templates, and daily execution advice inside the central hub. Unrestricted entry parameters apply.</p>
        <CTAButton />
      </div>

      {isActivationModalOpen && <ActivationModal onClose={() => setIsActivationModalOpen(false)} />}
      <TestimonialPopup />
    </div>
  ); 
}




