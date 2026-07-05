import { useState } from "react";
import PaystackPop from "@paystack/inline-js";
import { paystackConfig } from "../config/paystack";
import { useAuth } from "../context/AuthContext";

/**
 * Stateful Automation Hook governing inline payment modal initialization.
 * Utilizes the official npm module client to ensure unbreachable layout compilation.
 */
export default function usePaystackCheckout() {
  const { userProfile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Triggers the native Paystack checkout modal over the active application viewport.
   * 
   * @param {Function} onSuccessCallback - Receives transaction reference payload on complete.
   * @param {Function} onCloseCallback - Triggers when the user exits the popup window frame.
   */
  const initializeInlinePayment = (onSuccessCallback, onCloseCallback) => {
    if (!userProfile) {
      console.error("Authorization Violation: Profile context is missing.");
      return;
    }

    setIsProcessing(true);

    // Calculate currency value mappings precisely matching blueprint guidelines
    const calculatedPaymentAmount = userProfile.packagePlan === "platinum" ? 9000 : 14500;
    const totalAmountInKobo = calculatedPaymentAmount * 100;

    try {
      // Instantiate the modular class constructor directly from the installed package
      const paystackInstance = new PaystackPop();

      paystackInstance.newTransaction({
        key: paystackConfig.publicKey,
        email: userProfile.email,
        amount: totalAmountInKobo,
        currency: "NGN",
        ref: `VELORA-${userProfile.username.toUpperCase()}-${Date.now()}`,
        
        onSuccess: (transactionResponse) => {
          setIsProcessing(false);
          if (onSuccessCallback && transactionResponse.reference) {
            onSuccessCallback(transactionResponse.reference);
          }
        },
        
        onCancel: () => {
          setIsProcessing(false);
          if (onCloseCallback) {
            onCloseCallback();
          }
        }
      });
    } catch (error) {
      setIsProcessing(false);
      console.error("Paystack Module Execution Failure:", error);
      alert("Unable to open secure gateway. Please verify your internet connection link.");
    }
  };

  return {
    isReady: true, // Installed package ensures modules are instantly hydrated on mount
    isProcessing,
    triggerPayment: initializeInlinePayment
  };
}
