import { useState, useEffect } from "react";
import { formatToNaira } from "../utils/formatters";
import { useAuth } from "../context/AuthContext"; 
import { 
  subscribeToUnverifiedUsers, 
  subscribeToPendingWithdrawals, 
  approveUserRegistration, 
  approvePlatformWithdrawal,
  subscribeToSystemSettings,
  toggleWithdrawalGate,
   subscribeToAllPendingLoans,
  updateLoanTicketStatus
} from "../api/admin";

export default function AdminPanel({ onNavigate }) {
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [systemSettings, setSystemSettings] = useState({ withdrawalsEnabled: true });
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotice, setAdminNotice] = useState({ type: "", text: "" });

  useEffect(() => {
    const unsubscribeUsers = subscribeToUnverifiedUsers(setUnverifiedUsers);
    const unsubscribePayouts = subscribeToPendingWithdrawals(setPendingPayouts);
    const unsubscribeSettings = subscribeToSystemSettings(setSystemSettings);

    return () => {
      unsubscribeUsers();
      unsubscribePayouts();
      unsubscribeSettings();
    };
  }, []);

    const [pendingLoans, setPendingLoans] = useState([]);

  // Attaches the real-time background stream listener for incoming loan tickets
  useEffect(() => {
    const unsubscribeLoans = subscribeToAllPendingLoans((loansList) => {
      setPendingLoans(loansList);
    });
    return () => unsubscribeLoans();
  }, []);

  const handleLoanResolve = async (ticketId, targetUserId, loanAmount, decision) => {
    setIsProcessing(true);
    setAdminNotice({ type: "", text: "" });
    try {
      await updateLoanTicketStatus(ticketId, targetUserId, loanAmount, decision);
      setAdminNotice({
        type: "success",
        text: `Loan request successfully ${decision === "approved" ? "approved and funded" : "declined"}.`
      });
    } catch (err) {
      setAdminNotice({ type: "error", text: err.message });
    } finally {
      setIsProcessing(false);
    }
  };


  const handleGateToggle = async () => {
    setIsProcessing(true);
    try {
      await toggleWithdrawalGate(systemSettings.withdrawalsEnabled);
      setAdminNotice({ type: "success", text: `Platform withdrawal gate updated successfully!` });
    } catch (err) {
      setAdminNotice({ type: "error", text: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUserVerify = async (userId) => {
    setIsProcessing(true);
    try {
      await approveUserRegistration(userId);
      setAdminNotice({ type: "success", text: "User account verified successfully!" });
    } catch (err) { setAdminNotice({ type: "error", text: err.message }); }
    finally { setIsProcessing(false); }
  };

  const handleWithdrawalApprove = async (ticketId) => {
    setIsProcessing(true);
    try {
      await approvePlatformWithdrawal(ticketId);
      setAdminNotice({ type: "success", text: "Withdrawal ticket signed off as successful!" });
    } catch (err) { setAdminNotice({ type: "error", text: err.message }); }
    finally { setIsProcessing(false); }
  };

  const tableHeaderStyle = { padding: "12px", textAlign: "left", color: "var(--text-slate)", fontSize: "12px", borderBottom: "1px solid rgba(139, 92, 246, 0.2)" };
  const tableCellStyle = { padding: "12px", color: "var(--text-white)", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.05)" };

  return (
    <div className="velora-canvas" style={{ padding: "40px 20px", display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "1100px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: "var(--text-white)", margin: 0, fontSize: "24px", fontWeight: "800" }}>CENTRAL COMMAND SYSTEM 👑</h2>
          <p style={{ color: "var(--text-slate)", fontSize: "14px", margin: "4px 0 0 0" }}>Manage members, toggles, and process pending bank withdrawals instantly.</p>
        </div>
        <button type="button" onClick={() => onNavigate("DASHBOARD")} style={{ background: "transparent", border: "1px solid var(--neon-violet)", color: "var(--text-white)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>Return to Dashboard</button>
      </div>

      {adminNotice.text && (
        <div style={{ width: "100%", maxWidth: "1100px", padding: "14px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", textAlign: "center", background: adminNotice.type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)", border: adminNotice.type === "error" ? "1px solid #EF4444" : "1px solid #10B981", color: adminNotice.type === "error" ? "#EF4444" : "#10B981" }}>{adminNotice.text}</div>
      )}

      {/* ⬇️ GLOBAL WITHDRAWAL CONTROL TOGGLE SWITCH BOARD MODULE ⬇️ */}
      <div className="gold-border-frame" style={{ width: "100%", maxWidth: "1100px", background: "var(--bg-dark-card)", padding: "20px 24px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h4 style={{ margin: 0, color: "var(--text-white)", fontSize: "15px", fontWeight: "700" }}>SYSTEM WALLET SWITCH GATEWAY</h4>
          <p style={{ margin: "4px 0 0 0", color: "var(--text-slate)", fontSize: "12px" }}>Toggle on or off to completely lock or open user withdrawal checkout panels live.</p>
        </div>
        <button type="button" onClick={handleGateToggle} disabled={isProcessing} className="premium-pulse-button" style={{ padding: "12px 24px", borderRadius: "8px", fontWeight: "800", fontSize: "13px", background: systemSettings.withdrawalsEnabled ? "#EF4444" : "#10B981", color: "var(--text-white)", border: "none" }}>
          {systemSettings.withdrawalsEnabled ? "🔒 FREEZE ALL PLATFORM WITHDRAWALS" : "🔓 OPEN WITHDRAWAL WALLETS LIVE"}
        </button>
      </div>

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
        <h3 style={{ color: "var(--text-white)", fontSize: "16px", margin: "0 0 16px 0", fontWeight: "800" }}> PENDING BANK WITHDRAWAL TICKETS ({pendingPayouts.length})</h3>
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
                    <td style={ticket.id === ticket.id ? tableCellStyle : tableCellStyle}>{ticket.username}</td>
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

      {/* SECTION 3: CENTRAL PLATFORM LOAN MANAGER TABLE */}
      <div className="neon-border-glow" style={{ background: "var(--bg-dark-card)", width: "100%", maxWidth: "1100px", borderRadius: "16px", padding: "24px", marginTop: "12px" }}>
        <h3 style={{ color: "var(--gold-accent)", fontSize: "16px", margin: "0 0 16px 0", fontWeight: "800" }}>🏦 PENDING PLATFORM CREDIT LOANS ({pendingLoans.length})</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>FULL NAME / USERNAME</th>
                <th style={tableHeaderStyle}>EMAIL ADDRESS</th>
                <th style={tableHeaderStyle}>REQUESTED CAPITAL</th>
                <th style={tableHeaderStyle}>ACTION MANAGEMENT SETTLEMENT</th>
              </tr>
            </thead>
            <tbody>
              {pendingLoans.length === 0 ? (
                <tr><td colSpan="4" style={{ ...tableCellStyle, textAlign: "center", padding: "24px", color: "var(--text-slate)" }}>No credit loan requests currently pending verification.</td></tr>
              ) : (
                pendingLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td style={tableCellStyle}>
                      <div style={{ fontWeight: "700" }}>{loan.fullName}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-slate)" }}>@{loan.username}</div>
                    </td>
                    <td style={tableCellStyle}>{loan.email}</td>
                    <td style={{ ...tableCellStyle, color: "var(--gold-accent)", fontWeight: "800" }}>{formatToNaira(loan.amount)}</td>
                    <td style={tableCellStyle}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button type="button" onClick={() => handleLoanResolve(loan.id, loan.uid, loan.amount, "approved")} disabled={isProcessing} className="premium-pulse-button" style={{ padding: "8px 14px", borderRadius: "6px", fontSize: "12px", background: "#10B981", color: "#fff", border: "none" }}>APPROVE</button>
                        <button type="button" onClick={() => handleLoanResolve(loan.id, loan.uid, loan.amount, "declined")} disabled={isProcessing} style={{ padding: "8px 14px", borderRadius: "6px", fontSize: "12px", background: "#EF4444", color: "#fff", border: "none", cursor: "pointer" }}>DECLINE</button>
                      </div>
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


