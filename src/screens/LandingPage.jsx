import CTAButton from "../components/CTAButton";
import TestimonialPopup from "../components/TestimonialPopup";
import PackageCard from "../components/PackageCard";

export default function LandingPage({ onNavigate }) {
  // Production marketing content strings
  const promotionalFliers = [
    { title: "Post on WhatsApp Status (Earn Up to ₦125k Daily)", text: "What to do 👉Download the AI music videos on the platform. Action: Post them on your WhatsApp Status. Payment⚠️ : Get paid based on your views and consistency." },
    { title: "Get Quick Business Loans", text: "What to do: Apply inside the app. Action: No heavy paper, no guarantor, no headache.  Payment⚠️ : Get fast cash credited to expand your business.  " },
    { title: "Watch & Rate Videos (Earn ₦10k – ₦20k Daily)", text: "What to do: Watch one short AI video daily. Action: Just give it a star rating. Payment⚠️ : Make ₦10,000 to ₦20,000 every day. " },
  ];

  const platinumFeatures = ["Access to Platinum Dashboard", "₦8,000 Immediate Welcome Voucher", "Daily Affiliate Commision Access", "24/7 Premium Telegram Channel VIP Invite"];
  const goldFeatures = ["Access to Gold Dashboard", "₦13,000 High-Tier Welcome Voucher", "Priority Fast-Track Withdrawals", "Airtight Step-by-Step Mentorship System Link"];

  return (
    <div className="velora-canvas" style={{ padding: "40px 20px", display: "flex", flexDirection: "column", gap: "60px", alignItems: "center" }}>
      {/* Top Section Header Panel */}
      <header style={{ width: "100%", maxWidth: "1200px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="gold-text-accent" style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "1.5px" }}>VELORA</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button 
            onClick={() => onNavigate("AUTH")} 
            style={{ background: "transparent", border: "none", color: "var(--text-white)", cursor: "pointer", fontWeight: "600" }}
          >
            Login / Register
          </button>
          <CTAButton styleOverrides={{ padding: "10px 20px", fontSize: "13px" }} />
        </div>
      </header>

      {/* Hero Visual Section Container */}
      <section style={{ textAlign: "center", maxWidth: "800px", marginTop: "40px" }}>
        <h2 style={{ fontSize: "42px", fontWeight: "800", color: "var(--text-white)", marginBottom: "20px", lineHeight: "1.2" }}>
      
         just 5 minutes a day on your phone and wake up to a alerts in Dollars,<br /> straight to your Nigerian bank app? <span className="gold-text-accent">Welcome to VELORA—the ultimate platform where your opinion, your phone, and your WhatsApp Status become an unstoppable money-making machine.</span>
        </h2>
        <p style={{ color: "var(--text-slate)", fontSize: "16px", lineHeight: "1.6", marginBottom: "32px" }}>
         Why Global Earners Are Rushing to VELORA <br />

Earn in Dollars: Get paid in USD, cash out straight to your Nigerian bank account. <br />

Instant Welcome Bonus: Get ₦8,000 to ₦13,000 back to WITHDRAW immediately you register. <br />

Urgent Loans: Borrow money to start or grow your business with zero collateral and no stress. 
        </p>
        <CTAButton styleOverrides={{ fontSize: "16px", padding: "16px 36px" }} />
      </section>

      {/* Dynamic Flier/Feature Displays */}
      <section style={{ width: "100%", maxWidth: "1000px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        {promotionalFliers.map((flier, idx) => (
          <div key={idx} className="neon-border-glow" style={{ padding: "28px", borderRadius: "12px", background: "var(--bg-dark-card)" }}>
            <h4 className="gold-text-accent" style={{ fontSize: "18px", marginBottom: "12px", fontWeight: "700" }}>{flier.title}</h4>
            <p style={{ color: "var(--text-slate)", fontSize: "14px", lineHeight: "1.6" }}>{flier.text}</p>
          </div>
        ))}
      </section>

      {/* Product Packaging Price Matrix Grid */}
      <section style={{ width: "100%", maxWidth: "900px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "32px", marginTop: "20px" }}>
        <PackageCard 
          planType="Platinum" 
          cost={9000} 
          initialBalance={8000} 
          features={platinumFeatures} 
          onSelectPlan={(plan) => onNavigate("AUTH", plan)} 
        />
        <PackageCard 
          planType="Gold" 
          cost={14500} 
          initialBalance={13000} 
          features={goldFeatures} 
          onSelectPlan={(plan) => onNavigate("AUTH", plan)} 
        />
      </section>

      {/* Bottom Section Layout */}
      <footer style={{ marginTop: "40px", textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }}>
        <CTAButton />
        <p style={{ fontSize: "12px", color: "var(--text-slate)", opacity: 0.6 }}>© 2026 Velora Platform. All structural rights secured.</p>
      </footer>

      {/* Background Social Proof Engine Ticker Component */}
      <TestimonialPopup />
    </div>
  );
}
