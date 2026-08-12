import { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
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
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      
      // ⬇️ FIXED: Removed the broken .snapshot typo completely ⬇️
      const profileSnapshot = await getDoc(doc(db, "users", userCredential.user.uid));
      if (profileSnapshot.exists()) {
        setUserProfile(profileSnapshot.data());
      }
      return userCredential;
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

  useEffect(() => {
    let unsubscribeFromFirestoreSnapshot = null;

    const unsubscribeFromAuthObserver = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        unsubscribeFromFirestoreSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (documentSnapshot) => {
            if (documentSnapshot.exists()) {
              setUserProfile(documentSnapshot.data());
            }
            setIsLoading(false); // Turn off the spinner immediately
          },
          (error) => {
            console.error("Firestore connection lag:", error);
            setIsLoading(false); // Force-kill spinner on failure
          }
        );
      } else {
        if (unsubscribeFromFirestoreSnapshot) {
          unsubscribeFromFirestoreSnapshot();
        }
        setUserProfile(null);
        setIsLoading(false); // Turn off spinner if logged out
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




