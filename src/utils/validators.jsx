/**
 * Validates registration input strings against structural format patterns.
 * Returns an object containing a boolean flag and a specific error message string.
 */
export const validateRegistrationForm = ({ fullName, email, username, password, confirmPassword }) => {
  // Check for empty string omissions
  if (!fullName || !email || !username || !password) {
    return { isValid: false, message: "All registration input fields are required." };
  }

  // Sanitize trailing white spaces and validate basic email string layouts
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: "Please provide a valid structural email address." };
  }

  // Enforce username formatting constraints (alphanumeric only, no special symbols)
  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
  if (!usernameRegex.test(username.trim())) {
    return { isValid: false, message: "Username must be 3-15 characters (letters, numbers, underscores)." };
  }

  // Enforce password security threshold parameters
  if (password.length < 6) {
    return { isValid: false, message: "Security standard rule: Password must be at least 6 characters." };
  }

  // Validate strict string equivalence across password input fields
  if (password !== confirmPassword) {
    return { isValid: false, message: "Input validation error: Passwords do not match." };
  }

  return { isValid: true, message: "" };
};
