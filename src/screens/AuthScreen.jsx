import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { validateRegistrationForm } from "../utils/validators";

export default function AuthScreen({ onNavigate, preferredPlan }) {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(!!preferredPlan);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    packagePlan: preferredPlan || "platinum"
  });

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const executeFormSubmission = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        const validationResult = validateRegistrationForm(formState);
        if (!validationResult.isValid) {
          setErrorMessage(validationResult.message);
          setIsSubmitting(false); // FIXED: Turn off spinner
          return;
        }
        
        // 1. Submit form data to the authentication backend handler
        await register(formState);

        // 2. ⬇️ PLACED TRACKER SNIPPET: Trigger Meta tracking instantly upon true success ⬇️
        if (window.fbq) {
          window.fbq('track', 'CompleteRegistration');
        }

      } else {
        await login(formState.email, formState.password);
      }
    } catch (err) {
      // FIXED: Convert native Firebase errors into clean, readable warnings
      let customerFriendlyMessage = err.message;
      if (err.code === "auth/email-already-in-use") customerFriendlyMessage = "This email is already registered.";
      if (err.code === "auth/invalid-email") customerFriendlyMessage = "Invalid email formatting.";
      if (err.code === "auth/weak-password") customerFriendlyMessage = "The password must be at least 6 characters.";
      if (err.code === "auth/operation-not-allowed") customerFriendlyMessage = "Email/Password sign-in is not enabled in Firebase Console.";

      setErrorMessage(customerFriendlyMessage);
      setIsSubmitting(false); // FIXED: Turn off spinner immediately on error
    }
  };

  return (
    <div className="velora-canvas" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div className="neon-border-glow" style={{ background: "var(--bg-dark-card)", maxWidth: "440px", width: "100%", padding: "36px 28px", borderRadius: "16px" }}>
        
        <div style={{ display: "flex", gap: "16px", marginBottom: "28px", borderBottom: "1px solid rgba(139, 92, 246, 0.2)" }}>
          <button 
            type="button"
            onClick={() => { setIsRegisterMode(false); setErrorMessage(""); }}
            style={{ flex: 1, paddingBottom: "12px", background: "transparent", border: "none", borderBottom: !isRegisterMode ? "2px solid var(--gold-accent)" : "none", color: !isRegisterMode ? "var(--text-white)" : "var(--text-slate)", fontWeight: "600", cursor: "pointer" }}
          >
            SIGN IN
          </button>
          <button 
            type="button"
            onClick={() => { setIsRegisterMode(true); setErrorMessage(""); }}
            style={{ flex: 1, paddingBottom: "12px", background: "transparent", border: "none", borderBottom: isRegisterMode ? "2px solid var(--gold-accent)" : "none", color: isRegisterMode ? "var(--text-white)" : "var(--text-slate)", fontWeight: "600", cursor: "pointer" }}
          >
            REGISTER
          </button>
        </div>

        {errorMessage && (
          <p style={{ color: "#EF4444", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {errorMessage}
          </p>
        )}

        <form onSubmit={executeFormSubmission} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {isRegisterMode && (
            <>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Full Name</label>
                <input type="text" name="fullName" value={formState.fullName} onChange={handleInputChange} style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "var(--bg-deep-purple)", border: "1px solid var(--neon-violet)", color: "var(--text-white)", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Preferred Username</label>
                <input type="text" name="username" value={formState.username} onChange={handleInputChange} style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "var(--bg-deep-purple)", border: "1px solid var(--neon-violet)", color: "var(--text-white)", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Select Tier package</label>
                <select name="packagePlan" value={formState.packagePlan} onChange={handleInputChange} style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "var(--bg-deep-purple)", border: "1px solid var(--neon-violet)", color: "var(--text-white)", outline: "none" }}>
                  <option value="platinum">Velora Platinum (₦9,000)</option>
                  <option value="gold">Velora Gold (₦14,500)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Email Address</label>
            <input type="email" name="email" value={formState.email} onChange={handleInputChange} style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "var(--bg-deep-purple)", border: "1px solid var(--neon-violet)", color: "var(--text-white)", outline: "none" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Password</label>
            <input type="password" name="password" value={formState.password} onChange={handleInputChange} style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "var(--bg-deep-purple)", border: "1px solid var(--neon-violet)", color: "var(--text-white)", outline: "none" }} />
          </div>

          {isRegisterMode && (
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formState.confirmPassword} onChange={handleInputChange} style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "var(--bg-deep-purple)", border: "1px solid var(--neon-violet)", color: "var(--text-white)", outline: "none" }} />
            </div>
          )}

          <button 
            type="submit" 
            className="premium-pulse-button" 
            style={{ width: "100%", padding: "14px", borderRadius: "8px", marginTop: "12px" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "PROCESSING TRANSACTION..." : isRegisterMode ? "COMPLETE REGISTRATION" : "SECURE LOGIN"}
          </button>

          <button 
            type="button"
            onClick={() => onNavigate("LANDING")}
            style={{ background: "transparent", border: "none", color: "var(--text-slate)", fontSize: "13px", cursor: "pointer", marginTop: "8px" }}
          >
            ← Back to Landing
          </button>
        </form>
      </div>
    </div>
  );
}
