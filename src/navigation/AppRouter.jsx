import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Reusable structural component imports with verified project root paths
import LandingPage from "../screens/LandingPage";
import AuthScreen from "../screens/AuthScreen";
import Dashboard from "../screens/Dashboard";
import VideoTasks from "../screens/VideoTasks";
import WithdrawPortal from "../screens/WithdrawPortal";
import AdminPanel from "../screens/AdminPanel"; // ◄ INJECTED THE NEW ADMIN VIEW

export default function AppRouter() {
  const { currentUser, userProfile, isLoading } = useAuth();
  const [authScreenView, setAuthScreenView] = useState("DASHBOARD"); 
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [forceActivationPopup, setForceActivationPopup] = useState(false);
  const [isNetworkTimeoutCleared, setIsNetworkTimeoutCleared] = useState(false);

  useEffect(() => {
    const loadingGuardTimeout = setTimeout(() => {
      setIsNetworkTimeoutCleared(true);
    }, 2500);
    return () => clearTimeout(loadingGuardTimeout);
  }, [isLoading]);

  const shouldRenderSpinner = isLoading && !isNetworkTimeoutCleared;

  const navigateTo = (targetScreen, planContext = null) => {
    if (planContext) setSelectedPlan(planContext);
    
    if (targetScreen === "DASHBOARD_WITH_ACTIVATION_FORCE") {
      setForceActivationPopup(true);
      setAuthScreenView("DASHBOARD"); 
    } else {
      setAuthScreenView(targetScreen);
    }
  };

  if (shouldRenderSpinner) {
    return (
      <div className="velora-canvas" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0b0518" }}>
        <div className="velora-spinner" style={{ width: "40px", height: "40px", border: "4px solid rgba(139, 92, 246, 0.1)", borderTopColor: "var(--gold-accent, #daa520)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // ⬇️ SECURE ROUTING GATEWAY CONTROLLER FOR PRIVILEGED USERS ⬇️
  if (currentUser && userProfile) {
    // UNBREACHABLE ADMIN SHIELD: Regular earners are blocked and kicked to Dashboard if they spoof this route
    if (authScreenView === "ADMIN_PANEL") {
      if (userProfile.isAdmin === true) {
        return <AdminPanel onNavigate={navigateTo} />;
      } else {
        return <Dashboard onNavigate={navigateTo} forceOpenActivation={false} onClearForceOpen={() => {}} />;
      }
    }
    
    if (authScreenView === "VIDEO_TASKS") {
      return <VideoTasks onNavigate={navigateTo} />;
    }
    if (authScreenView === "WITHDRAW") {
      return <WithdrawPortal onNavigate={navigateTo} />;
    }
    
    return (
      <Dashboard 
        onNavigate={navigateTo} 
        forceOpenActivation={forceActivationPopup} 
        onClearForceOpen={() => setForceActivationPopup(false)} 
      />
    );
  }

  if (authScreenView === "AUTH") {
    return <AuthScreen onNavigate={navigateTo} preferredPlan={selectedPlan} />;
  }

  return <LandingPage onNavigate={navigateTo} />;
}




