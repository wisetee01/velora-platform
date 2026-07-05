import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Creates an unchangeable base user ledger profile record directly inside Firestore.
 * Matches structural mapping logic enforced by backend database rules.
 * 
 * @param {string} userId - The unique Firebase Authentication UID string.
 * @param {Object} userData - Registration payload details from the Auth submission.
 * @returns {Promise<void>} Resolves when structural data transaction is committed.
 */
export const createUserProfileRecord = async (userId, { fullName, email, username, packagePlan }) => {
  if (!userId) throw new Error("Database transaction rejected: Missing user identifier string reference.");
  
  const lowerPlan = packagePlan.trim().toLowerCase();

  // Validate plan explicitly before building the database payload
  if (lowerPlan !== "platinum" && lowerPlan !== "gold") {
    throw new Error("Database mapping exception: Unknown or unrecognized Velora package tier selected.");
  }

  const userDocumentReference = doc(db, "users", userId);

  // Directly inline the ternary assignment to clear any VS Code cache warnings
  const targetLedgerPayload = {
    uid: userId,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    username: username.trim().toLowerCase(),
    packagePlan: lowerPlan,
    balance: lowerPlan === "platinum" ? 8000 : 13000, 
    isActivated: false,
    createdAt: new Date().toISOString()
  };

  // Triggers setDoc. Any subsequent client-side update attempts will be auto-dropped by Firestore rules.
  await setDoc(userDocumentReference, targetLedgerPayload);
};

/**
 * Fetches and resolves a single read snapshot query for the active logged-in user profile.
 * 
 * @param {string} userId - Unique authenticated identity string indicator.
 * @returns {Promise<Object|null>} Returns the sanitized record payload or null if non-existent.
 */
export const fetchUserProfileRecord = async (userId) => {
  if (!userId) return null;
  
  const userDocumentReference = doc(db, "users", userId);
  const dataSnapshot = await getDoc(userDocumentReference);

  if (!dataSnapshot.exists()) {
    return null;
  }

  return dataSnapshot.data();
};
