import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Validates tracking logic and commits video task rewards directly into Firestore ledger attributes.
 */
export const completeDailyVideoTask = async (userId, userProfile, rewardAmount, videoId) => {
  if (!userId) throw new Error("Authentication error: Missing user identifier string.");
  
  // 1. ABSOLUTE SECURITY GATE: Block unverified users from processing earnings
  if (!userProfile?.isVerified && !userProfile?.isActivated) {
    throw new Error("Wallet Locked: You must activate your account to earn daily task rewards.");
  }

  // 2. CHECK TIMESTAMP PERSISTENCE: Block double-earning forgery attempts
  const todayDateString = new Date().toISOString().split("T")[0]; // Generates strict YYYY-MM-DD template
  const completedTasksList = userProfile.completedTasks || [];
  
  const hasDoneTaskToday = completedTasksList.some(task => task.date === todayDateString);
  if (hasDoneTaskToday) {
    throw new Error("Limit Reached: You have already completed your daily video rating task for today.");
  }

  const userDocumentReference = doc(db, "users", userId);

  // 3. ATOMIC TRANSACTION: Increment bank balances and record transaction log metadata inside Firestore
  const taskLogPayload = {
    videoId: videoId,
    date: todayDateString,
    earned: rewardAmount,
    timestamp: new Date().toISOString()
  };

  await updateDoc(userDocumentReference, {
    balance: increment(rewardAmount),
    completedTasks: arrayUnion(taskLogPayload)
  });

  return taskLogPayload;
};
