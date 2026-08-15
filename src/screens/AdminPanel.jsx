import { useState, useEffect } from "react";
import { formatToNaira } from "../utils/formatters";
// ⬇️ FIXED: Pointing directly to AuthContext to match your project root folders cleanly ⬇️
import { useAuth } from "../context/AuthContext"; 
import { 
  subscribeToUnverifiedUsers, 
  subscribeToPendingWithdrawals, 
  approveUserRegistration, 
  approvePlatformWithdrawal 
} from "../api/admin";

export default function AdminPanel({ onNavigate }) {
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotice, setAdminNotice] = useState({ type: "", text: "" });

  // CONSUME NATIVE STREAM SUBSCRIPTIONS FROM OUR CENTRALIZED DATA LAYER
  useEffect(() => {
    const unsubscribeUsers = subscribeToUnverifiedUsers((usersList) => {
      setUnverifiedUsers(usersList);
    });

    const unsubscribePayouts = subscribeToPendingWithdrawals((ticketsList) => {
      setPendingPayouts(ticketsList);
    });

    return () => {
      unsubscribeUsers();
      unsubscribePayouts();
    };
  }, []);

  const handleUserVerify = async (userId) => {
    setIsProcessing(true);
    setAdminNotice({ type: "", text: "" });
    try {
      await approveUserRegistration(userId);
      setAdminNotice({ type: "success", text: "User account verified successfully!" });
    } catch (err) {
      setAdminNotice({ type: "error", text: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawalApprove = async (ticketId) => {
    setIsProcessing(true);
    setAdminNotice({ type: "", text: "" });
    try {
      await approvePlatformWithdrawal(ticketId);
      setAdminNotice({ type: "success", text: "Withdrawal ticket signed off as successful!" });
    } catch (err) {
      setAdminNotice({ type: "error", text: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const tableHeaderStyle = { padding: "12px", textAlign: "left", color: "var(--text-slate)", fontSize: "12px", borderBottom: "1px solid rgba(139, 92, 246, 0.2)" };
  const tableCellStyle = { padding: "12px", color: "var(--text-white)", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.05)" };

  return (
    <div className="velora-canvas" style={{ padding: "40px 20px", display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "1100px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: "var(--text-white)", margin: 0, fontSize: "24px", fontWeight: "800" }}>CENTRAL COMMAND SYSTEM 👑</h2>
          <p style={{ color: "var(--text-slate)", fontSize: "14px", margin: "4px 0 0 0" }}>Manage members and process pending bank withdrawals instantly.</p>
        </div>
        <button type="button" onClick={() => onNavigate("DASHBOARD")} style={{ background: "transparent", border: "1px solid var(--neon-violet)", color: "var(--text-white)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>Return to Dashboard</button>
      </div>

      {adminNotice.text && (
        <div style={{ width: "100%", maxWidth: "1100px", padding: "14px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", textAlign: "center", background: adminNotice.type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)", border: adminNotice.type === "error" ? "1px solid #EF4444" : "1px solid #10B981", color: adminNotice.type === "error" ? "#EF4444" : "#10B981" }}>{adminNotice.text}</div>
      )}

      {/* SECTION 1: SIGNUP VERIFICATION MANAGER */}
      <div className="neon-border-glow" style={{ background: "var(--bg-dark-card)", width: "100%", maxWidth: "1100px", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ color: "var(--gold-accent)", fontSize: "16px", margin: "0 0 16px 0", fontWeight: "800" }}>🔒 PENDING ACCOUNT VERIFICATIONS ({unverifiedUsers.length})</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>FULL NAME</th>
                <th style={tableHeaderStyle}>USERNAME</th>
                <th style={tableHeaderStyle}>PACKAGE TIER</th>
                <th style={tableHeaderStyle}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {unverifiedUsers.length === 0 ? (
                <tr><td colSpan="4" style={{ ...tableCellStyle, textAlign: "center", padding: "24px", color: "var(--text-slate)" }}>No users currently pending verification.</td></tr>
              ) : (
                unverifiedUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={tableCellStyle}>{user.fullName}</td>
                    <td style={tableCellStyle}>{user.username}</td>
                    <td style={{ ...tableCellStyle, textTransform: "uppercase", color: "var(--gold-accent)" }}>{user.packagePlan}</td>
                    <td style={tableCellStyle}>
                      <button type="button" onClick={() => handleUserVerify(user.id)} disabled={isProcessing} className="premium-pulse-button" style={{ padding: "8px 16px", borderRadius: "6px", fontSize: "12px", background: "var(--gold-accent)", color: "#110922" }}>APPROVE MEMBERSHIP</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: BANK PAYOUT SETTLEMENT TABLE */}
      <div className="neon-border-glow" style={{ background: "var(--bg-dark-card)", width: "100%", maxWidth: "1100px", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ color: "var(--text-white)", fontSize: "16px", margin: "0 0 16px 0", fontWeight: "800" }}>💸 PENDING BANK WITHDRAWAL TICKETS ({pendingPayouts.length})</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>USERNAME</th>
                <th style={tableHeaderStyle}>BANK NAME</th>
                <th style={tableHeaderStyle}>ACCOUNT DETAILS</th>
                <th style={tableHeaderStyle}>CASH-OUT AMOUNT</th>
                <th style={tableHeaderStyle}>ACTION SETTLEMENT</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayouts.length === 0 ? (
                <tr><td colSpan="5" style={{ ...tableCellStyle, textAlign: "center", padding: "24px", color: "var(--text-slate)" }}>No withdrawal requests currently pending payment.</td></tr>
              ) : (
                pendingPayouts.map((ticket) => (
                  <tr key={ticket.id}>
                    <td style={tableCellStyle}>{ticket.username}</td>
                    <td style={{ ...tableCellStyle, fontWeight: "700" }}>{ticket.bankName}</td>
                    <td style={tableCellStyle}>
                      <div style={{ fontWeight: "800" }}>{ticket.accountNumber}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-slate)" }}>{ticket.accountName}</div>
                    </td>
                    <td style={{ ...tableCellStyle, color: "#10B981", fontWeight: "800" }}>{formatToNaira(ticket.amount)}</td>
                    <td style={tableCellStyle}>
                      <button type="button" onClick={() => handleWithdrawalApprove(ticket.id)} disabled={isProcessing} className="premium-pulse-button" style={{ padding: "8px 16px", borderRadius: "6px", fontSize: "12px" }}>MARK SUCCESSFUL</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

