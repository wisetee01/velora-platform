/**
 * Safely constructs an absolute Telegram URI string containing pre-filled text verification data.
 * Bypasses local server structures to hand off user tracking parameters seamlessly.
 * 
 * @param {string} username - The registered identifier tag of the user profile.
 * @param {string} referenceId - The immutable unique tracking string from Paystack.
 * @returns {string} Fully encoded URL ready for window location redirection.
 */
export const generateActivationProofUrl = (username, referenceId) => {
  // Replace this placeholder link with your actual official Velora support channel or admin username link
  const BASE_TELEGRAM_LINK = "https://t.me/veloraofficial0"; 
  
  const rawMessageText = `Hello Velora Official, I've made my payment for Velora activation. Kindly activate my account.\n\nUser Reference Details:\n• Username: ${username.trim()}\n• Paystack Ref ID: ${referenceId.trim()}`;
  
  // Encode special characters and spacing accurately to ensure url integrity across mobile platforms
  const encodedTextParameter = encodeURIComponent(rawMessageText);
  
  return `${BASE_TELEGRAM_LINK}?text=${encodedTextParameter}`;
};

/**
 * Returns your unrestricted general mentorship channel anchor link.
 * 
 * @returns {string} The public Telegram invite anchor.
 */
export const getMentorshipChannelUrl = () => {
  // Replace this placeholder with your exact public mentorship group invite link
  return "https://t.me/veloraofficiiall";
};
