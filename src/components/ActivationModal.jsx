import { useState } from "react";
import { generateActivationProofUrl } from "../services/telegramService";
import { useAuth } from "../context/AuthContext";

/**
 * Gatekeeper overlay block requiring payment initialization hooks.
 */
export default function ActivationModal({ onClose }) {
  const { userProfile } = useAuth();
  const [showBankDetails, setShowBankDetails] = useState(false);
  
  // Track copy feedback messages independently
  const [copiedField, setCopiedField] = useState(""); 

  if (!userProfile) return null;

  const handlePaymentExecution = () => {
    setShowBankDetails(true);
  };

  const handleManualProofClick = () => {
    const fallbackUrl = generateActivationProofUrl(userProfile.username, "MANUAL-VERIFY-" + Date.now().toString().slice(-6));
    window.location.href = fallbackUrl;
  };

  // Safe universal clipboard copier function
  const handleCopyToClipboard = (textToCopy, fieldIdentifier) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopiedField(fieldIdentifier);
          setTimeout(() => setCopiedField(""), 2000); // Reset text back after 2 seconds
        })
        .catch((err) => console.error("Could not copy text: ", err));
    }
  };

  const backdropStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 5, 29, 0.85)",
    backdropFilter: "blur(8px)",
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  };

  const cardStyle = {
    background: "var(--bg-dark-card)",
    maxWidth: "480px",
    width: "100%",
    padding: "36px 28px",
    borderRadius: "16px",
    textAlign: showBankDetails ? "left" : "center"
  };

  const copyButtonStyle = {
    background: "rgba(139, 92, 246, 0.15)",
    border: "1px solid var(--neon-violet, #8b5cf6)",
    color: "var(--gold-accent, #fff)",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    cursor: "pointer",
    fontWeight: "600",
    marginLeft: "auto",
    transition: "all 0.2s"
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "4px 0"
  };

  return (
    <div style={backdropStyle}>
      <div className="neon-border-glow" style={cardStyle}>
        
        {!showBankDetails ? (
          <>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
            <h2 style={{ color: "var(--text-white)", fontSize: "22px", marginBottom: "12px", fontWeight: "700" }}>
              ACCOUNT UNVERIFIED
            </h2>
            <p style={{ color: "var(--text-slate)", fontSize: "14px", lineHeight: "1.6", marginBottom: "28px" }}>
              Your profile must be verified before making any withdrawals. Click below to view our verified merchant bank accounts and secure your registration status.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button 
                className="premium-pulse-button"
                style={{ padding: "16px", width: "100%", borderRadius: "8px", letterSpacing: "1px", background: "var(--gold-accent)", border: "none", color: "var(--bg-deep-purple)", fontWeight: "700", cursor: "pointer" }}
                onClick={handlePaymentExecution}
              >
                ACTIVATE ACCOUNT NOW!
              </button>
              <button 
                onClick={handleManualProofClick}
                style={{ background: "transparent", border: "1px solid var(--neon-violet)", color: "var(--text-white)", padding: "12px", width: "100%", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}
              >
                I've made my payment (Send Proof to Telegram)
              </button>
              <button 
                onClick={onClose}
                style={{ background: "transparent", border: "none", color: "var(--text-slate)", cursor: "pointer", fontSize: "13px", marginTop: "8px" }}
              >
                Cancel and Return
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 className="gold-text-accent" style={{ fontSize: "20px", fontWeight: "800", textAlign: "center", marginBottom: "4px" }}>
              MANUAL VERIFICATION
            </h3>
            
            <p style={{ fontSize: "14px", lineHeight: "1.5", color: "var(--text-white)", margin: 0 }}>
              Make a payment to one of Our Verified Merchant accounts below.
            </p>

            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", padding: "12px", borderRadius: "8px" }}>
              <p style={{ color: "#EF4444", fontSize: "13px", fontWeight: "600", margin: 0, lineHeight: "1.4" }}>
                *NOTE ⚠️: We don't accept payments from Opay. You can transfer your money to another bank before sending. Thank you*
              </p>
            </div>

            {/* Merchant Details with Instant Click-To-Copy Fields */}
            <div style={{ background: "var(--bg-deep-purple, #1a102f)", padding: "16px", borderRadius: "8px", border: "1px solid var(--neon-violet, #8b5cf6)", display: "flex", flexDirection: "column", gap: "10px" }}>
              
              <div style={rowStyle}>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--text-slate)" }}>Bank Name: <strong style={{ color: "#fff" }}>9 Payment Service Bank</strong></p>
                <button 
                  type="button" 
                  style={copyButtonStyle} 
                  onClick={() => handleCopyToClipboard("9 Payment Service Bank", "bank")}
                >
                  {copiedField === "bank" ? "Copied! ✓" : "Copy"}
                </button>
              </div>

              <div style={rowStyle}>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--text-slate)" }}>Account Name: <strong style={{ color: "#fff" }}>TAIWO MAROOF</strong></p>
              </div>

              <div style={rowStyle}>
                <p style={{ margin: 0, fontSize: "15px", color: "var(--text-slate)" }}>Account Number: <strong className="gold-text-accent" style={{ fontSize: "18px", letterSpacing: "1px" }}>6095786597</strong></p>
                <button 
                  type="button" 
                  style={{ ...copyButtonStyle, background: "var(--gold-accent)", color: "var(--bg-deep-purple)", border: "none" }} 
                  onClick={() => handleCopyToClipboard("6095786597", "number")}
                >
                  {copiedField === "number" ? "Copied! ✓" : "Copy"}
                </button>
              </div>

            </div>

            <p style={{ textAlign: "center", fontStyle: "italic", fontSize: "13px", margin: "4px 0 0 0", color: "var(--text-white)" }}>
              Let's make money together on VELORA 🤗🖤
            </p>

            <p style={{ textAlign: "center", fontSize: "14px", fontWeight: "700", color: "var(--gold-accent)", margin: 0 }}>
              Congratulations in advance 👏 ☺️
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
              <button 
                onClick={handleManualProofClick}
                className="premium-pulse-button"
                style={{ padding: "14px", width: "100%", borderRadius: "8px", border: "none", color: "#fff", fontWeight: "600", cursor: "pointer" }}
              >
                Send Transfer Receipt Proof
              </button>
              <button 
                onClick={() => setShowBankDetails(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-slate)", cursor: "pointer", fontSize: "13px", textAlign: "center" }}
              >
                ← Go Back
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
