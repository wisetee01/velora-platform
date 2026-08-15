import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { formatToNaira } from "../utils/formatters";
import { completeDailyVideoTask } from "../api/tasks";

export default function VideoTasks({ onNavigate }) {
  const { currentUser, userProfile } = useAuth();
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Explicit marketing reward multipliers calculated cleanly by chosen plan tiers
  const dailyEarningRate = userProfile?.packagePlan === "gold" ? 3000 : 1500;
  const todayString = new Date().toISOString().split("T")[0];
  const isTaskAlreadyDoneToday = userProfile?.completedTasks?.some(t => t.date === todayString);

  // Dynamic template repository for video items mapping across your layout canvas
  const availableVideoClips = [
    { id: "vid_01", title: "Premium Brand Promotion Review", duration: "30s", embedId: "dQw4w9WgXcQ" },
    { id: "vid_02", title: "Digital Asset Performance Metric Overview", duration: "30s", embedId: "dQw4w9WgXcQ" },
    { id: "vid_03", title: "Velora Community Scaling Milestone Feed", duration: "30s", embedId: "dQw4w9WgXcQ" }
  ];

  const handleRatingSubmit = async (videoId) => {
    if (selectedRating === 0) return setStatusMessage({ type: "error", text: "Please select a star rating first." });
    setIsProcessing(true);
    setStatusMessage({ type: "", text: "" });

    try {
      await completeDailyVideoTask(currentUser.uid, userProfile, dailyEarningRate, videoId);
      setStatusMessage({ type: "success", text: `Success! ${formatToNaira(dailyEarningRate)} added to your withdrawal wallet.` });
      setActiveVideo(null);
      setSelectedRating(0);
    } catch (err) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="velora-canvas" style={{ padding: "40px 20px", display: "flex", flexDirection: "column", gap: "28px", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "900px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: "var(--text-white)", margin: 0, fontSize: "24px", fontWeight: "800" }}>DAILY VIDEO RATING TASKS 🎥</h2>
          <p style={{ color: "var(--text-slate)", fontSize: "14px", margin: "4px 0 0 0" }}>Rate clips to instantly scale your available withdrawal ledger funds.</p>
        </div>
        <button onClick={() => onNavigate("DASHBOARD")} style={{ background: "transparent", border: "1px solid var(--neon-violet)", color: "var(--text-white)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>← Back</button>
      </div>

      {statusMessage.text && (
        <div style={{ width: "100%", maxWidth: "900px", padding: "14px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", textAlign: "center", background: statusMessage.type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)", border: statusMessage.type === "error" ? "1px solid #EF4444" : "1px solid #10B981", color: statusMessage.type === "error" ? "#EF4444" : "#10B981" }}>{statusMessage.text}</div>
      )}

      {isTaskAlreadyDoneToday ? (
        <div className="gold-border-frame" style={{ width: "100%", maxWidth: "900px", padding: "40px", textAlign: "center", background: "var(--bg-dark-card)", borderRadius: "16px" }}>
          <h3 style={{ color: "var(--gold-accent)", fontSize: "22px", margin: "0 0 8px 0" }}>🎉 ALL DAILY TASKS COMPLETED</h3>
          <p style={{ color: "var(--text-white)", fontSize: "14px", margin: 0 }}>Your next premium clip catalog resets automatically at midnight. Keep executing consistent actions!</p>
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: "900px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {availableVideoClips.map((video) => (
            <div key={video.id} className="neon-border-glow" style={{ background: "var(--bg-dark-card)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", border: activeVideo?.id === video.id ? "1px solid var(--gold-accent)" : "1px solid rgba(139, 92, 246, 0.2)" }}>
              <div style={{ height: "140px", borderRadius: "8px", background: "#0b0518", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid rgba(139, 92, 246, 0.1)" }}>
                {activeVideo?.id === video.id ? (
                  <iframe width="100%" height="100%" src={`https://youtube.com{video.embedId}?autoplay=1&controls=0`} title="Video Player" frameBorder="0" allow="autoplay" />
                ) : (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gold-accent)" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                )}
              </div>
              <div>
                <h4 style={{ color: "var(--text-white)", fontSize: "15px", margin: 0, fontWeight: "700" }}>{video.title}</h4>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", color: "var(--text-slate)" }}>
                  <span>Duration: {video.duration}</span>
                  <span style={{ color: "var(--gold-accent)", fontWeight: "700" }}>Payout: +{formatToNaira(dailyEarningRate)}</span>
                </div>
              </div>

              {activeVideo?.id === video.id ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "auto" }}>
                  <div style={{ display: "flex", gap: "8px", width: "100%", justifyContent: "center" }}>
                    {/* FIXED: The array is fully and safely spelled out right here */}
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setSelectedRating(star)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "20px", color: star <= selectedRating ? "var(--gold-accent)" : "rgba(139, 92, 246, 0.3)" }}>★</button>
                    ))}
                  </div>
                  <button type="button" onClick={() => handleRatingSubmit(video.id)} disabled={isProcessing} className="premium-pulse-button" style={{ width: "100%", padding: "10px", borderRadius: "6px", fontSize: "13px" }}>{isProcessing ? "SUBMITTING..." : "SUBMIT STAR RATING"}</button>
                </div>
              ) : (
                <button type="button" onClick={() => { setActiveVideo(video); setSelectedRating(0); }} className="premium-pulse-button" style={{ width: "100%", padding: "10px", borderRadius: "6px", marginTop: "auto", fontSize: "13px", background: "transparent", border: "1px solid var(--gold-accent)", color: "var(--gold-accent)" }}>WATCH & RATE CLIP</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

