import useTestimonials from "../hooks/useTestimonials";
import { formatToNaira } from "../utils/formatters";

/**
 * Floating notification layout using the 2-second social proof hook.
 */
export default function TestimonialPopup() {
  const activeTestimonial = useTestimonials();

  // Guard against initial mounting latency passes
  if (!activeTestimonial) return null;

  const floatingContainerStyle = {
    position: "fixed",
    bottom: "24px",
    left: "24px",
    zIndex: 9999,
    maxWidth: "340px",
    padding: "16px",
    borderRadius: "12px",
    background: "var(--bg-dark-card)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
  };

  return (
    <div className="neon-border-glow" style={floatingContainerStyle} key={activeTestimonial.id}>
      <div style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "var(--gold-accent)",
        boxShadow: "0 0 8px var(--gold-glow)"
      }} />
      <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
        <p style={{ color: "var(--text-white)", fontWeight: "600" }}>
          {activeTestimonial.name} <span style={{ color: "var(--neon-violet-glow)", fontWeight: "normal" }}>from {activeTestimonial.state}</span>
        </p>
        <p style={{ color: "var(--text-slate)", fontSize: "13px" }}>
          Successfully withdrew <span className="gold-text-accent" style={{ fontWeight: "700" }}>{formatToNaira(activeTestimonial.amount)}</span>
        </p>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
