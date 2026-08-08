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
  const { currentUser, isLoading } = useAuth();
  const [authScreenView, setAuthScreenView] = useState("LANDING"); // Values: "LANDING" or "AUTH"
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Custom router state tracking registration overrides to trigger automatic popups
  const [forceActivationPopup, setForceActivationPopup] = useState(false);

  // ⬇️ SAFELY OVERRIDE INITIALIZATION TIMING FREEZES INSIDE RESTRICTED TELEGRAM BROWSER WEBVIEWS ⬇️
  const [isNetworkTimeoutCleared, setIsNetworkTimeoutCleared] = useState(false);

  useEffect(() => {
    // If your cloud database state takes more than 2500ms to verify credentials inside an in-app browser frame,
    // explicitly trigger a fallback override to kill the yellow spinner before the layout engine hangs.
    const loadingGuardTimeout = setTimeout(() => {
      setIsNetworkTimeoutCleared(true);
    }, 2500);

    return () => clearTimeout(loadingGuardTimeout);
  }, [isLoading]);

  // Combine native background auth states with our structural timeout fallback indicator
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
      setAuthScreenView("LANDING"); // Reset landing router viewport state parameters
    } else if (targetScreen === "LANDING" || targetScreen === "AUTH") {
      setAuthScreenView(targetScreen);
    }
  };

  // Render tracker layout using global variables only if safely within the network timeout bounds
  if (shouldRenderSpinner) {
    return (
      <div className="velora-canvas" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0b0518" }}>
        <div className="velora-spinner" style={{ width: "40px", height: "40px", border: "4px solid rgba(139, 92, 246, 0.1)", borderTopColor: "var(--gold-accent, #daa520)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // UNBREACHABLE GUARD RULE: If a valid authentication user session exists, ALWAYS force Dashboard
  if (currentUser) {
    return (
      <Dashboard 
        onNavigate={navigateTo} 
        forceOpenActivation={forceActivationPopup} 
        onClearForceOpen={() => setForceActivationPopup(false)} 
      />
    );
  }

  // Fallback to public routes if no active authentication session is discovered
  if (authScreenView === "AUTH") {
    return <AuthScreen onNavigate={navigateTo} preferredPlan={selectedPlan} />;
  }

  return <LandingPage onNavigate={navigateTo} />;
}
