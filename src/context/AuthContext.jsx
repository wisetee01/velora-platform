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
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
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
    try {
      return await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logoutUserAccount = async () => {
    setIsLoading(true);
    setUserProfile(null);
    setCurrentUser(null);
    setIsLoading(false);
    return signOut(auth);
  };

  // Pure Native Live-Sync Database Observer
  useEffect(() => {
    let unsubscribeFromFirestoreSnapshot = null;

    const unsubscribeFromAuthObserver = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      // Tear down any active snapshot listeners left over from previous users
      if (unsubscribeFromFirestoreSnapshot) {
        unsubscribeFromFirestoreSnapshot();
      }

      if (user) {
        // Pure native listener path: Handles reloads and log-ins instantly in one stream
        unsubscribeFromFirestoreSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (documentSnapshot) => {
            if (documentSnapshot.exists()) {
              setUserProfile(documentSnapshot.data());
            }
            setIsLoading(false); // ◄ Turn off yellow spinner instantly when data lands
          },
          (error) => {
            console.error("Firestore real-time connection error:", error);
            setIsLoading(false); // ◄ Safety catch: Turn off spinner immediately if network/rules block read
          }
        );
      } else {
        setUserProfile(null);
        setIsLoading(false); // ◄ Turn off spinner if user is completely logged out
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





