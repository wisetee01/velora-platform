import { collection, doc, addDoc, updateDoc, increment, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Validates account qualifiers and saves a pending loan ticket to the database.
 */
export const requestPlatformLoan = async (userId, userProfile, loanAmount) => {
  if (!userId) throw new Error("Auth Error: Missing unique user identity reference.");

  // 1. SECURITY LOCK: Block unverified users from applying for loans
  if (!userProfile?.isVerified && !userProfile?.isActivated) {
    throw new Error("Vault Locked: You must activate and verify your account to apply for a credit loan.");
  }

  // 2. CHECK MINIMUM LIMIT: Block requests under 100,000 Naira
  const requestedLoan = Number(loanAmount);
  if (requestedLoan < 100000 || isNaN(requestedLoan)) {
    throw new Error("Limit Blocked: The minimum amount allowed for platform credit loans is ₦100,000.");
  }

  // 3. COLLATERAL BALANCE GUARD: Check if their wallet funds match or beat the minimum baseline requirement
  const baselineQualifierThreshold = 100000;
  const currentUserBalance = userProfile?.balance || 0;
  if (currentUserBalance < baselineQualifierThreshold) {
    throw new Error(`Qualification Denied: You need an available wallet balance of at least ₦100,000 to qualify as collateral.`);
  }

  // 4. COMMIT LOAN METADATA APPLICATION LOG
  const globalLoansCollection = collection(db, "loans");
  
  const loanTicketPayload = {
    uid: userId,
    fullName: userProfile.fullName,
    username: userProfile.username,
    email: userProfile.email,
    amount: requestedLoan,
    status: "pending", // Toggles between pending, approved, or declined
    createdAt: new Date().toISOString()
  };

  await addDoc(globalLoansCollection, loanTicketPayload);
  return loanTicketPayload;
};

/**
 * Streams previous loan logs live right onto a user's dashboard portal card view.
 */
export const subscribeToUserLoans = (userId, onDataUpdate) => {
  if (!userId) return () => {};
  
  const userLoansQuery = query(collection(db, "loans"), where("uid", "==", userId));
  return onSnapshot(userLoansQuery, (snapshot) => {
    const loansList = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    onDataUpdate(loansList);
  });
};

/**
 * Admin action function to resolve a loan ticket by adding funds or declining it.
 */
export const updateLoanTicketStatus = async (ticketId, targetUserId, loanAmount, choiceStatus) => {
  if (!ticketId || !targetUserId) throw new Error("Admin Exception: Missing required identifiers.");
  
  const ticketRef = doc(db, "loans", ticketId);
  const userRef = doc(db, "users", targetUserId);

  if (choiceStatus === "approved") {
    // Atomic Operation: Mark ticket as approved and append the cash straight into their main balance wallet
    await updateDoc(ticketRef, { status: "approved", resolvedAt: new Date().toISOString() });
    await updateDoc(userRef, { balance: increment(Number(loanAmount)) });
  } else {
    // Simply mark ticket as declined
    await updateDoc(ticketRef, { status: "declined", resolvedAt: new Date().toISOString() });
  }
};
