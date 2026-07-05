/**
 * Strips raw numeric floating values and converts them to formatted Nigerian Naira text.
 * Falls back safely to ₦0.00 if numerical input formatting parsing breaks.
 */
export const formatToNaira = (numericAmount) => {
  const parseableValue = Number(numericAmount);
  
  if (isNaN(parseableValue)) {
    return "₦0.00";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2
  }).format(parseableValue);
};

/**
 * Normalizes system date timestamps to clean, localized string patterns.
 */
export const formatDisplayDate = (timestamp) => {
  if (!timestamp) return "";
  
  const dateObj = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  
  return dateObj.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
