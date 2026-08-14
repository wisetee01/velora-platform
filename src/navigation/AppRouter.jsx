import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Reusable structural component imports with verified project root paths
import LandingPage from "../screens/LandingPage";
import AuthScreen from "../screens/AuthScreen";
import Dashboard from "../screens/Dashboard";

/**
 * Core Application Navigation Guard Machine.
 * Manages view switching based on explicit authentication state matrix parameters.
 */
export default function AppRouter() {
  const { currentUser, userProfile, isLoading } = useAuth();
  const [authScreenView, setAuthScreenView] = useState("LANDING"); // Values: "LANDING" or "AUTH"
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Custom router state tracking registration overrides to trigger automatic popups
  const [forceActivationPopup, setForceActivationPopup] = useState(false);

  // Safely override initialization timing freezes inside restricted browser environments
  const [isNetworkTimeoutCleared, setIsNetworkTimeoutCleared] = useState(false);

  useEffect(() => {
    // Timeout guard to prevent eternal loading wheels if the network connection stalls
    const loadingGuardTimeout = setTimeout(() => {
      setIsNetworkTimeoutCleared(true);
    }, 2500);

    return () => clearTimeout(loadingGuardTimeout);
  }, [isLoading]);

  // Combine background database loading states with our network override guard
  const shouldRenderSpinner = isLoading && !isNetworkTimeoutCleared;

  /**
   * Universal structural routing switcher function.
   * Exposed down to elements to control screen state modifications cleanly.
   */
  const navigateTo = (targetScreen, planContext = null) => {
    if (planContext) {
      setSelectedPlan(planContext);
    }
    
    // Catch the special registration success signal to arm the dashboard auto-open flag
    if (targetScreen === "DASHBOARD_WITH_ACTIVATION_FORCE") {
      setForceActivationPopup(true);
      setAuthScreenView("LANDING"); 
    } else if (targetScreen === "LANDING" || targetScreen === "AUTH") {
      setAuthScreenView(targetScreen);
    }
  };

  // Render yellow tracker loading loop layout if safely within the network hydration bounds
  if (shouldRenderSpinner) {
    return (
      <div className="velora-canvas" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0b0518" }}>
        <div className="velora-spinner" style={{ width: "40px", height: "40px", border: "4px solid rgba(139, 92, 246, 0.1)", borderTopColor: "var(--gold-accent, #daa520)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // ⬇️ UNBREACHABLE NAVIGATION RULE: Force Dashboard ONLY if user auth AND user database profile data exist ⬇️
  if (currentUser && userProfile) {
    return (
      <Dashboard 
        onNavigate={navigateTo} 
        forceOpenActivation={forceActivationPopup} 
        onClearForceOpen={() => setForceActivationPopup(false)} 
      />
    );
  }

  // Fallback to public routes if no active authentication database profile data is discovered yet
  if (authScreenView === "AUTH") {
    return <AuthScreen onNavigate={navigateTo} preferredPlan={selectedPlan} />;
  }

  return <LandingPage onNavigate={navigateTo} />;
}

