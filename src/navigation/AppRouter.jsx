import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Lazy import mappings to prevent circular reference compilation breaks across layers
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

  /**
   * Universal structural routing switcher function.
   * Exposed down to elements to control screen state modifications cleanly.
   */
  const navigateTo = (targetScreen, planContext = null) => {
    if (planContext) {
      setSelectedPlan(planContext);
    }
    
    if (targetScreen === "LANDING" || targetScreen === "AUTH") {
      setAuthScreenView(targetScreen);
    }
  };

  // Render using global brand style variables injected from Layer 8 (theme.css)
  if (isLoading) {
    return (
      <div className="velora-canvas" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="velora-spinner" />
      </div>
    );
  }

  // UNBREACHABLE GUARD RULE: If a valid authentication user session exists, ALWAYS force Dashboard
  if (currentUser) {
    return <Dashboard onNavigate={navigateTo} />;
  }

  // Fallback to public routes if no active authentication session is discovered
  if (authScreenView === "AUTH") {
    return <AuthScreen onNavigate={navigateTo} preferredPlan={selectedPlan} />;
  }

  return <LandingPage onNavigate={navigateTo} />;
}
