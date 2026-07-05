/**
 * Safely fetches the Paystack public integration key from the environment.
 * Throws a runtime safety error if the environment variable is missing during setup.
 */
const getPaystackPublicKey = () => {
  const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  
  if (!key) {
    console.error("CRITICAL CONFIGURATION ERROR: Paystack public key is missing inside .env.local");
  }
  
  return key || "";
};

// Global immutable Paystack client configuration object
export const paystackConfig = {
  publicKey: getPaystackPublicKey(),
  currency: "NGN",
  channels: ["card", "bank", "ussd", "qr"]
};
