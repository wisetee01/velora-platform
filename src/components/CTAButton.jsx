import { getMentorshipChannelUrl } from "../services/telegramService";

/**
 * Standardized premium glowing CTA link anchor element.
 */
export default function CTAButton({ styleOverrides = {} }) {
  const channelUrl = getMentorshipChannelUrl();

  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "15px",
    letterSpacing: "0.5px",
    textDecoration: "none",
    ...styleOverrides
  };

  return (
    <a 
      href={channelUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="premium-pulse-button"
      style={baseStyles}
    >
      Join our free Mentorship Channel
    </a>
  );
}
