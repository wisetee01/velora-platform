import { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { createUserProfileRecord } from "../api/users";

const AuthContext = createContext(null);

/**
 * Global Architecture State Wrapper tracking active credentials and profile parameters.
 */
export const AuthProvider = ({ children }) => {
  // Read session markers to prevent immediate loading screens during initial hydration frames
  const [currentUser, setCurrentUser] = useState(() => auth.currentUser);
  const [userProfile, setUserProfile] = useState(() => {
    const cachedProfile = sessionStorage.getItem("velora_profile_cache");
    return cachedProfile ? JSON.parse(cachedProfile) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Orchestrates multi-layer account registration sequencing.
   * Leverages Auth SDK creation then immediately branches off to seed the initial data ledger.
   */
  const registerUserAccount = async (formPayload) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formPayload.email.trim(), 
        formPayload.password
      );
      
      // Hand off authenticated state markers to Layer 2 for secure record setup
      await createUserProfileRecord(userCredential.user.uid, formPayload);
      return userCredential.user;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Executes simple state-transition logins matching email and password credentials.
   */
  const loginUserAccount = async (email, password) => {
    setIsLoading(true);
    return signInWithEmailAndPassword(auth, email.trim(), password);
  };

  /**
   * Erases all operational memory contexts upon profile exits.
   */
  const logoutUserAccount = async () => {
    setIsLoading(true);
    sessionStorage.removeItem("velora_profile_cache");
    setUserProfile(null);
    return signOut(auth);
  };

  /**
   * Listens directly to real-time auth changes.
   * Seamlessly spins up a live tracking pipeline to watch database activations on the free tier.
   */
  useEffect(() => {
    let unsubscribeFromFirestoreSnapshot = null;

    const unsubscribeFromAuthObserver = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        // Establishes a real-time reactive pipeline to capture manual admin upgrades instantly
        unsubscribeFromFirestoreSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (documentSnapshot) => {
            if (documentSnapshot.exists()) {
              const profileData = documentSnapshot.data();
              setUserProfile(profileData);
              // Safe-cache profile memory string to bypass network timing lag on instant reloads
              sessionStorage.setItem("velora_profile_cache", JSON.stringify(profileData));
            }
            // Explicitly kill loading state after data payload structure resolves safely
            setIsLoading(false);
          },
          (error) => {
            console.error("Firestore localized tracking error:", error);
            setIsLoading(false);
          }
        );
      } else {
        // Tear down any leftover active listener blocks on logout
        if (unsubscribeFromFirestoreSnapshot) {
          unsubscribeFromFirestoreSnapshot();
        }
        sessionStorage.removeItem("velora_profile_cache");
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    // Cleanup hook intervals and subscription pipelines accurately upon mounting structural resets
    return () => {
      unsubscribeFromAuthObserver();
      if (unsubscribeFromFirestoreSnapshot) {
        unsubscribeFromFirestoreSnapshot();
      }
    };
  }, []);

  const sharedContextStateMatrix = {
    currentUser,
    userProfile,
    isLoading,
    register: registerUserAccount,
    login: loginUserAccount,
    logout: logoutUserAccount
  };

  return (
    <AuthContext.Provider value={sharedContextStateMatrix}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Isolated Consumer Engine that elements use to safely ingest profile values.
 */
export const useAuth = () => {
  const customContextInstance = useContext(AuthContext);
  if (!customContextInstance) {
    throw new Error("Architecture Violation: useAuth must be consumed inside a declared AuthProvider.");
  }
  return customContextInstance;
};