import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { formatToNaira } from "../utils/formatters";
import { requestPlatformWithdrawal, subscribeToUserWithdrawals } from "../api/withdrawals";
import { subscribeToSystemSettings } from "../api/admin"; // ◄ INJECTED THE LIVE SWITCH ACCESS CONTROL LINK

export default function WithdrawPortal({ onNavigate }) {
  const { currentUser, userProfile } = useAuth();
  const [amount, setAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({ bankName: "", accountNumber: "", accountName: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [systemSettings, setSystemSettings] = useState({ withdrawalsEnabled: true }); // ◄ TRACKS CENTRAL LOCK STATE

  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsubscribeHistory = subscribeToUserWithdrawals(currentUser.uid, setPayoutHistory);
    const unsubscribeSettings = subscribeToSystemSettings(setSystemSettings);

    return () => {
      unsubscribeHistory();
      unsubscribeSettings();
    };
  }, [currentUser]);

  const handleInputChange = (e) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const handlePayoutSubmit = async (e) => {
    e.preventDefault();
    if (!systemSettings.withdrawalsEnabled) return setMessage({ type: "error", text: "Withdrawals are currently paused by the platform." });
    if (!amount || !bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountName) {
      return setMessage({ type: "error", text: "Please fill out all withdrawal form fields." });
    }
    
    setIsProcessing(true);
    setMessage({ type: "", text: "" });

    try {
      const currentBalance = userProfile?.balance !== undefined ? userProfile.balance : (userProfile?.packagePlan === "gold" ? 50750 : 31500);
      const unifiedProfileContext = { ...userProfile, balance: currentBalance };

      await requestPlatformWithdrawal(currentUser.uid, unifiedProfileContext, amount, bankDetails);
      setMessage({ type: "success", text: "Payout Request Lodged! Your funds are pending approval." });
      setAmount("");
      setBankDetails({ bankName: "", accountNumber: "", accountName: "" });
    } catch (err) { setMessage({ type: "error", text: err.message }); }
    finally { setIsProcessing(false); }
  };

  const formInputStyle = {
    width: "100%", padding: "12px", borderRadius: "8px",
    background: "var(--bg-deep-purple, #1a102f)", border: "1px solid var(--neon-violet, #8b5cf6)",
    color: "var(--text-white, #fff)", outline: "none", fontSize: "14px", marginTop: "6px"
  };

  const displayWalletFunds = userProfile?.balance !== undefined ? userProfile.balance : (userProfile?.packagePlan === "gold" ? 50750 : 31500);

  return (
    <div className="velora-canvas" style={{ padding: "40px 20px", display: "flex", flexDirection: "column", gap: "28px", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "500px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: "var(--text-white)", margin: 0, fontSize: "22px", fontWeight: "800" }}>WITHDRAWAL PORTAL 💰</h2>
          <p style={{ color: "var(--text-slate)", fontSize: "13px", margin: "4px 0 0 0" }}>Request safe payout withdrawals directly to your local bank account.</p>
        </div>
        <button type="button" onClick={() => onNavigate("DASHBOARD")} style={{ background: "transparent", border: "1px solid var(--neon-violet)", color: "var(--text-white)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>← Back</button>
      </div>

      <div className="neon-border-glow" style={{ background: "var(--bg-dark-card)", maxWidth: "500px", width: "100%", padding: "32px 24px", borderRadius: "16px" }}>
        <div style={{ background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.2)", padding: "16px", borderRadius: "8px", marginBottom: "24px", textAlign: "center" }}>
          <span style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", textTransform: "uppercase" }}>Your Wallet Balance</span>
          <span style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-white)" }}>{formatToNaira(displayWalletFunds)}</span>
        </div>

        {message.text && (
          <p style={{ color: message.type === "error" ? "#EF4444" : "#10B981", background: message.type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)", padding: "12px", borderRadius: "8px", fontSize: "13px", marginBottom: "20px", border: message.type === "error" ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(16, 185, 129, 0.2)" }}>{message.text}</p>
        )}

        {/* ⬇️ SEAMLESS ACCESS CONTROL SHIELD DETECTOR GRID TUNNEL ⬇️ */}
        {!systemSettings.withdrawalsEnabled ? (
          <div style={{ border: "1px dashed #EF4444", background: "rgba(239, 68, 68, 0.05)", padding: "32px 20px", borderRadius: "12px", textAlign: "center" }}>
            <h3 style={{ color: "#EF4444", fontSize: "18px", margin: "0 0 8px 0", fontWeight: "800" }}>❌ WITHDRAWAL UNAVAILABLE</h3>
            <p style={{ color: "var(--text-white)", fontSize: "13px", margin: 0, lineHeight: "1.6" }}>Withdrawals are currently paused by the platform. No wallet is currently open for withdrawal.</p>
          </div>
        ) : (
          <form onSubmit={handlePayoutSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)" }}>Amount to Withdraw (Minimum ₦10,000)</label>
              <input type="number" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 15000" style={formInputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)" }}>Select Destination Bank</label>
              <input type="text" name="bankName" value={bankDetails.bankName} onChange={handleInputChange} placeholder="e.g. Access Bank, GTBank, UBA" style={formInputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)" }}>Account Number (10 Digits)</label>
              <input type="text" maxLength="10" name="accountNumber" value={bankDetails.accountNumber} onChange={handleInputChange} placeholder="e.g. 0123456789" style={formInputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)" }}>Account Name</label>
              <input type="text" name="accountName" value={bankDetails.accountName} onChange={handleInputChange} placeholder="e.g. John Doe" style={formInputStyle} />
            </div>
            <button type="submit" className="premium-pulse-button" style={{ width: "100%", padding: "14px", borderRadius: "8px", marginTop: "8px", cursor: "pointer", fontWeight: "700" }} disabled={isProcessing}>
              {isProcessing ? "PROCESSING CHECKOUT..." : "SUBMIT WITHDRAWAL REQUEST"}
            </button>
          </form>
        )}
      </div>

      {/* LIVE WITHDRAWAL HISTORY LEDGER BOARD */}
      <div className="neon-border-glow" style={{ background: "var(--bg-dark-card)", maxWidth: "500px", width: "100%", padding: "24px", borderRadius: "16px", marginTop: "12px" }}>
        <h3 style={{ color: "var(--text-white)", fontSize: "14px", margin: "0 0 16px 0", fontWeight: "800" }}>📋 YOUR PAYOUT LOG HISTORY</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {payoutHistory.length === 0 ? (
            <p style={{ color: "var(--text-slate)", fontSize: "13px", margin: 0, textAlign: "center", padding: "12px" }}>You haven't submitted any cash-out requests yet.</p>
          ) : (
            payoutHistory.map((ticket) => {
              const isPending = ticket.status === "pending";
              return (
                <div key={ticket.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-deep-purple, #1a102f)", padding: "14px 16px", borderRadius: "8px", border: isPending ? "1px solid rgba(218, 165, 32, 0.2)" : "1px solid rgba(16, 185, 129, 0.2)" }}>
                  <div>
                    <span style={{ display: "block", color: "var(--text-white)", fontWeight: "700", fontSize: "15px" }}>{formatToNaira(ticket.amount)}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-slate)" }}>{ticket.bankName} • {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "Recent"}</span>
                  </div>
                  <span style={{ 
                    fontSize: "11px", fontWeight: "800", padding: "4px 10px", borderRadius: "4px", textTransform: "uppercase",
                    background: isPending ? "rgba(218, 165, 32, 0.1)" : "rgba(16, 185, 129, 0.1)",
                    color: isPending ? "var(--gold-accent, #daa520)" : "#10B981",
                    border: isPending ? "1px solid rgba(218, 165, 32, 0.2)" : "1px solid rgba(16, 185, 129, 0.2)"
                  }}>
                    {ticket.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

