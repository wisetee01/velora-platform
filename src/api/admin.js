import { doc, updateDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Attaches a real-time data stream to capture unverified user rows.
 */
export const subscribeToUnverifiedUsers = (onDataUpdate) => {
  const usersQuery = query(collection(db, "users"), where("isVerified", "==", false));
  return onSnapshot(usersQuery, (snapshot) => {
    const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    onDataUpdate(usersList);
  });
};

/**
 * Attaches a real-time data stream to capture pending cash-out requests.
 */
export const subscribeToPendingWithdrawals = (onDataUpdate) => {
  const payoutsQuery = query(collection(db, "withdrawals"), where("status", "==", "pending"));
  return onSnapshot(payoutsQuery, (snapshot) => {
    const ticketsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    onDataUpdate(ticketsList);
  });
};

/**
 * Instantly flips a member's verification tags to true inside the Firestore database.
 */
export const approveUserRegistration = async (targetUserId) => {
  if (!targetUserId) throw new Error("Admin Exception: Missing target user identifier.");
  const userRef = doc(db, "users", targetUserId);
  await updateDoc(userRef, {
    isVerified: true,
    isActivated: true
  });
};

/**
 * Signs off on a pending withdrawal ticket, updating its status to successful.
 */
export const approvePlatformWithdrawal = async (ticketId) => {
  if (!ticketId) throw new Error("Admin Exception: Missing target withdrawal ticket identifier.");
  const ticketRef = doc(db, "withdrawals", ticketId);
  await updateDoc(ticketRef, {
    status: "successful",
    approvedAt: new Date().toISOString()
  });
};
