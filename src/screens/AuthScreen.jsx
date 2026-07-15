import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { validateRegistrationForm } from "../utils/validators";

export default function AuthScreen({ onNavigate, preferredPlan }) {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(!!preferredPlan);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW STATES: Control password character visibility switches independently
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Reusable styling configurations for text fields and alignment layouts
  const inputStyle = {
    width: "100%",
    padding: "12px 42px 12px 12px", // Padded right edge so long input values do not clip into toggle text
    borderRadius: "8px",
    background: "var(--bg-deep-purple)",
    border: "1px solid var(--neon-violet)",
    color: "var(--text-white)",
    outline: "none"
  };

  const eyeToggleStyle = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "var(--text-slate)",
    cursor: "pointer",
    fontSize: "14px",
    userSelect: "none",
    padding: 0
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
                <input type="text" autoComplete="name" name="fullName" value={formState.fullName} onChange={handleInputChange} style={{ ...inputStyle, paddingRight: "12px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Preferred Username</label>
                <input type="text" autoComplete="username" name="username" value={formState.username} onChange={handleInputChange} style={{ ...inputStyle, paddingRight: "12px" }} />
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
            <input type="email" autoComplete="email" name="email" value={formState.email} onChange={handleInputChange} style={{ ...inputStyle, paddingRight: "12px" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showPassword ? "text" : "password"} 
                autoComplete={isRegisterMode ? "new-password" : "current-password"} 
                name="password" 
                value={formState.password} 
                onChange={handleInputChange} 
                style={inputStyle} 
              />
              <button 
                type="button" 
                style={eyeToggleStyle} 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  autoComplete="new-password" 
                  name="confirmPassword" 
                  value={formState.confirmPassword} 
                  onChange={handleInputChange} 
                  style={inputStyle} 
                />
                <button 
                  type="button" 
                  style={eyeToggleStyle} 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="premium-pulse-button" 
            style={{ width: "100%", padding: "14px", borderRadius: "8px", marginTop: "12px", cursor: "pointer" }}
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
