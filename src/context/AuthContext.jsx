
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

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => auth.currentUser);
  
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("velora_profile_sync");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isLoading, setIsLoading] = useState(true);

  const registerUserAccount = async (formPayload) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formPayload.email.trim(), 
        formPayload.password
      );
      await createUserProfileRecord(userCredential.user.uid, formPayload);
      return userCredential.user;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const loginUserAccount = async (email, password) => {
    setIsLoading(true);
    localStorage.removeItem("velora_profile_sync"); // Clear stale caches on fresh login attempts
    setUserProfile(null);
    return signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const logoutUserAccount = async () => {
    setIsLoading(true);
    localStorage.removeItem("velora_profile_sync");
    setUserProfile(null);
    setCurrentUser(null);
    setIsLoading(false);
    return signOut(auth);
  };

  useEffect(() => {
    let unsubscribeFromFirestoreSnapshot = null;

    const unsubscribeFromAuthObserver = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        unsubscribeFromFirestoreSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (documentSnapshot) => {
            if (documentSnapshot.exists()) {
              const profileData = documentSnapshot.data();
              setUserProfile(profileData);
              localStorage.setItem("velora_profile_sync", JSON.stringify(profileData));
            }
            // ◄ FIXED: Only turn off the loading spinner AFTER data is completely ready
            setIsLoading(false); 
          },
          (error) => {
            console.error("Firestore tracking error:", error);
            setIsLoading(false);
          }
        );
      } else {
        if (unsubscribeFromFirestoreSnapshot) {
          unsubscribeFromFirestoreSnapshot();
        }
        localStorage.removeItem("velora_profile_sync");
        setUserProfile(null);
        setIsLoading(false);
      }
    });

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

export const useAuth = () => {
  const customContextInstance = useContext(AuthContext);
  if (!customContextInstance) {
    throw new Error("Architecture Violation: useAuth must be consumed inside a declared AuthProvider.");
  }
  return customContextInstance;
};

