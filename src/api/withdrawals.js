import { collection, doc, addDoc, updateDoc, increment, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";


/**
 * Validates wallet bounds and logs a formal pending payout ticket inside Firestore.
 */
export const requestPlatformWithdrawal = async (userId, userProfile, payoutAmount, bankDetails) => {
  if (!userId) throw new Error("Auth Error: Missing unique user identity reference.");

  // 1. SECURITY LOCK: Block unverified users from requesting bank cash-outs
  if (!userProfile?.isVerified && !userProfile?.isActivated) {
    throw new Error("Portal Locked: You must activate your account to request balance payouts.");
  }

  // 2. CHECK BALANCE BOUNDS: Prevent overdraft requests
  const requestedFundsAmount = Number(payoutAmount);
  if (requestedFundsAmount <= 0 || isNaN(requestedFundsAmount)) {
    throw new Error("Invalid Input: Please type a real numerical withdrawal amount.");
  }
  
  if (userProfile.balance < requestedFundsAmount) {
    throw new Error(`Insufficient Funds: Your available wallet balance is only ${userProfile.balance} Naira.`);
  }

  // 3. MINIMUM PAYOUT LIMIT: Enforce threshold configurations (e.g. 10,000 Naira minimum)
  const minimumPayoutThreshold = 10000;
  if (requestedFundsAmount < minimumPayoutThreshold) {
    throw new Error(`Limit Blocked: The minimum amount allowed for balance cash-outs is ₦10,000.`);
  }

  // 4. COMMIT PAYOUT METADATA LEDGER SLIP
  const userDocumentReference = doc(db, "users", userId);
  const globalWithdrawalsCollection = collection(db, "withdrawals");

  const withdrawalTicketPayload = {
    uid: userId,
    fullName: userProfile.fullName,
    username: userProfile.username,
    email: userProfile.email,
    amount: requestedFundsAmount,
    bankName: bankDetails.bankName.trim(),
    accountNumber: bankDetails.accountNumber.trim(),
    accountName: bankDetails.accountName.trim(),
    status: "pending", // Changes to approved when you pay them from your bank app
    createdAt: new Date().toISOString()
  };

  // Atomic Operation: Deduct balance from user profile and file the payment request log simultaneously
  await addDoc(globalWithdrawalsCollection, withdrawalTicketPayload);
  await updateDoc(userDocumentReference, {
    balance: increment(-requestedFundsAmount)
  });

  return withdrawalTicketPayload;

};

/**
 * Attaches a real-time data stream to fetch previous payout requests matching a specific user.
 */
export const subscribeToUserWithdrawals = (userId, onDataUpdate) => {
  if (!userId) return () => {};
  
  const userPayoutsQuery = query(
    collection(db, "withdrawals"), 
    where("uid", "==", userId)
  );
  
  return onSnapshot(userPayoutsQuery, (snapshot) => {
    const historyList = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
    onDataUpdate(historyList);
  });
};

