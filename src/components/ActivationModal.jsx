import usePaystackCheckout from "../hooks/usePaystackCheckout";
import { generateActivationProofUrl } from "../services/telegramService";
import { useAuth } from "../context/AuthContext";

/**
 * Gatekeeper overlay block requiring payment initialization hooks.
 */
export default function ActivationModal({ onClose }) {
  const { userProfile } = useAuth();
  const { triggerPayment, isProcessing, isReady } = usePaystackCheckout();

  if (!userProfile) return null;

  const handlePaymentExecution = () => {
    // Launch inline payment layout via custom logic hooks
    triggerPayment((paystackReferenceId) => {
      // SUCCESS CALLBACK: Construct redirect template link and hand off session parameters
      const telegramConfirmationUrl = generateActivationProofUrl(userProfile.username, paystackReferenceId);
      
      // Relocate frame safely to official support channel
      window.location.href = telegramConfirmationUrl;
    });
  };

  const handleManualProofClick = () => {
    // Emergency manual redirect link fallback using dummy metadata if checkout callback loses frame focus
    const fallbackUrl = generateActivationProofUrl(userProfile.username, "MANUAL-VERIFY-" + Date.now().toString().slice(-6));
    window.location.href = fallbackUrl;
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
    textAlign: "center"
  };

  return (
    <div style={backdropStyle}>
      <div className="neon-border-glow" style={cardStyle}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
        
        <h2 style={{ color: "var(--text-white)", fontSize: "22px", marginBottom: "12px", fontWeight: "700" }}>
          ACCOUNT UNVERIFIED
        </h2>
        
        <p style={{ color: "var(--text-slate)", fontSize: "14px", lineHeight: "1.6", marginBottom: "28px" }}>
          Your profile must be verified before making any withdrawals. Click below to make your payment via Paystack inline checkout and secure your registration status.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button 
            className="premium-pulse-button"
            style={{ padding: "16px", width: "100%", borderRadius: "8px", letterSpacing: "1px", background: "var(--gold-accent)", border: "none", color: "var(--bg-deep-purple)" }}
            onClick={handlePaymentExecution}
            disabled={isProcessing || !isReady}
          >
            {!isReady ? "LOADING SECURE GATEWAY..." : isProcessing ? "INITIALIZING CHECKOUT..." : "ACTIVATE ACCOUNT NOW!"}
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
      </div>
    </div>
  );
}
