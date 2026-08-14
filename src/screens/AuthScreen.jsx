import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { validateRegistrationForm } from "../utils/validators";
import TestimonialPopup from "../components/TestimonialPopup";

export default function AuthScreen({ onNavigate, preferredPlan }) {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(!!preferredPlan);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          setIsSubmitting(false);
          return;
        }
        
        const alignedFormPayload = {
          ...formState,
          email: formState.email.trim().toLowerCase(),
          packagePlan: formState.packagePlan.trim().toLowerCase()
        };

        await register(alignedFormPayload);
        onNavigate("DASHBOARD_WITH_ACTIVATION_FORCE");
      } else {
        await login(formState.email.trim(), formState.password);
      }
    } catch (err) {
      setIsSubmitting(false);
      let friendlyMsg = err.message;
      if (err.code === "auth/email-already-in-use") friendlyMsg = "This email is already registered.";
      if (err.code === "auth/invalid-email") friendlyMsg = "Invalid email formatting.";
      if (err.code === "auth/weak-password") friendlyMsg = "The password must be at least 6 characters.";
      if (err.code === "auth/operation-not-allowed") friendlyMsg = "Email sign-in is disabled in Firebase Console.";
      if (err.message?.includes("INVALID_LOGIN_CREDENTIALS") || err.code === "auth/invalid-credential") {
        friendlyMsg = "Incorrect email address or password. Please try again.";
      }
      setErrorMessage(friendlyMsg);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 42px 12px 12px", borderRadius: "8px",
    background: "var(--bg-deep-purple)", border: "1px solid var(--neon-violet)",
    color: "var(--text-white)", outline: "none"
  };

  const eyeToggleStyle = {
    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
    background: "transparent", border: "none", color: "var(--text-slate)",
    cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center"
  };

  return (
    <div className="velora-canvas" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div className="neon-border-glow" style={{ background: "var(--bg-dark-card)", maxWidth: "440px", width: "100%", padding: "36px 28px", borderRadius: "16px" }}>
        
        <div style={{ display: "flex", gap: "16px", marginBottom: "28px", borderBottom: "1px solid rgba(139, 92, 246, 0.2)" }}>
          <button type="button" onClick={() => { setIsRegisterMode(false); setErrorMessage(""); }} style={{ flex: 1, paddingBottom: "12px", background: "transparent", border: "none", borderBottom: !isRegisterMode ? "2px solid var(--gold-accent)" : "none", color: !isRegisterMode ? "var(--text-white)" : "var(--text-slate)", fontWeight: "600", cursor: "pointer" }}>SIGN IN</button>
          <button type="button" onClick={() => { setIsRegisterMode(true); setErrorMessage(""); }} style={{ flex: 1, paddingBottom: "12px", background: "transparent", border: "none", borderBottom: isRegisterMode ? "2px solid var(--gold-accent)" : "none", color: isRegisterMode ? "var(--text-white)" : "var(--text-slate)", fontWeight: "600", cursor: "pointer" }}>REGISTER</button>
        </div>

        {errorMessage && (
          <p style={{ color: "#EF4444", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>{errorMessage}</p>
        )}

        <form onSubmit={executeFormSubmission} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {isRegisterMode && (
            <>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Full Name</label>
                <input type="text" name="fullName" value={formState.fullName} onChange={handleInputChange} style={{ ...inputStyle, paddingRight: "12px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Preferred Username</label>
                <input type="text" name="username" value={formState.username} onChange={handleInputChange} style={{ ...inputStyle, paddingRight: "12px" }} />
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
            <input type="email" name="email" value={formState.email} onChange={handleInputChange} style={{ ...inputStyle, paddingRight: "12px" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} name="password" value={formState.password} onChange={handleInputChange} style={inputStyle} />
              <button type="button" style={eyeToggleStyle} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--gold-accent)" }}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 10.43 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                )}
              </button>
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-slate)", marginBottom: "6px" }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formState.confirmPassword} onChange={handleInputChange} style={inputStyle} />
                <button type="button" style={eyeToggleStyle} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--gold-accent)" }}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 10.43 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                  )}
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="premium-pulse-button" style={{ width: "100%", padding: "14px", borderRadius: "8px", marginTop: "12px", cursor: "pointer", fontWeight: "700" }} disabled={isSubmitting}>
            {isSubmitting ? "PROCESSING..." : isRegisterMode ? "COMPLETE REGISTRATION" : "SECURE LOGIN"}
          </button>

          <button type="button" onClick={() => onNavigate("LANDING")} style={{ background: "transparent", border: "none", color: "var(--text-slate)", fontSize: "13px", cursor: "pointer", marginTop: "8px" }}>← Back to Landing</button>
        </form>
      </div>
      <TestimonialPopup />
    </div>
  );
}
