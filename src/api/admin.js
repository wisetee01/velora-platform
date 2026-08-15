import { doc, updateDoc, collection, onSnapshot, query, where, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Attaches a real-time data stream to capture platform configuration switches.
 */
export const subscribeToSystemSettings = (onDataUpdate) => {
  const settingsDocRef = doc(db, "system_settings", "payout_gate");
  return onSnapshot(settingsDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      onDataUpdate(docSnapshot.data());
    } else {
      // Default fallback initialization if document doesn't exist yet
      onDataUpdate({ withdrawalsEnabled: true });
    }
  });
};

/**
 * Instantly flips the platform withdrawal gate switch boolean inside Firestore.
 */
export const toggleWithdrawalGate = async (currentState) => {
  const settingsDocRef = doc(db, "system_settings", "payout_gate");
  await setDoc(settingsDocRef, { withdrawalsEnabled: !currentState }, { merge: true });
};

export const subscribeToUnverifiedUsers = (onDataUpdate) => {
  const usersQuery = query(collection(db, "users"), where("isVerified", "==", false));
  return onSnapshot(usersQuery, (snapshot) => {
    onDataUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const subscribeToPendingWithdrawals = (onDataUpdate) => {
  const payoutsQuery = query(collection(db, "withdrawals"), where("status", "==", "pending"));
  return onSnapshot(payoutsQuery, (snapshot) => {
    onDataUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  });
};

export const approveUserRegistration = async (targetUserId) => {
  if (!targetUserId) throw new Error("Admin Exception: Missing target user identifier.");
  await updateDoc(doc(db, "users", targetUserId), { isVerified: true, isActivated: true });
};

export const approvePlatformWithdrawal = async (ticketId) => {
  if (!ticketId) throw new Error("Admin Exception: Missing target withdrawal ticket identifier.");
  await updateDoc(doc(db, "withdrawals", ticketId), { status: "successful", approvedAt: new Date().toISOString() });
};

