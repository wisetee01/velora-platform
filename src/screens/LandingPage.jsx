import CTAButton from "../components/CTAButton";
import TestimonialPopup from "../components/TestimonialPopup";
import PackageCard from "../components/PackageCard";

export default function LandingPage({ onNavigate }) {
  const platinumFeatures = ["Access to Platinum Dashboard", "₦31,500 Immediate Welcome Voucher", "Daily Affiliate Commision Access", "24/7 Premium Telegram Channel VIP Invite"];
  const goldFeatures = ["Access to Gold Dashboard", "₦50,750 High-Tier Welcome Voucher", "Priority Fast-Track Withdrawals", "Airtight Step-by-Step Mentorship System Link"];

  return (
    <div className="velora-canvas" style={{ padding: "40px 20px", display: "flex", flexDirection: "column", gap: "60px", alignItems: "center" }}>
      {/* Top Section Header Panel */}
      <header style={{ width: "100%", maxWidth: "1200px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="gold-text-accent" style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "1.5px", margin: 0 }}>
          VELORA
        </h1>
        <nav style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button 
            onClick={() => onNavigate("AUTH")} 
            style={{ background: "transparent", border: "none", color: "var(--text-white)", cursor: "pointer", fontWeight: "600" }}
            aria-label="Velora Login or Registration"
          >
            Login / Register
          </button>
          <CTAButton styleOverrides={{ padding: "10px 20px", fontSize: "11px" }} />
        </nav>
      </header>

      {/* Hero Visual Section Container */}
           {/* Hero Visual Section Container with Side-by-Side Flyer Previews */}
      <section style={{ textAlign: "center", maxWidth: "800px", marginTop: "40px" }}>
        
        {/* ⬇️ FLEX WRAPPER CONTAINER: Forces images to sit perfectly beside each other ⬇️ */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginBottom: "32px", width: "100%", flexWrap: "wrap" }}>
          
          {/* IMAGE 1: Left Card */}
          <div style={{ width: "100%", maxWidth: "380px", height: "220px", borderRadius: "8px", overflow: "hidden", background: "#1a102f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img 
              src="/veloraa.png" 
              alt="velora Flyer" 
              style={{ width: "100%", height: "100%", objectFit: "contain" }} 
            />
          </div>

         

        </div>
        {/* ⬆️ FLEX WRAPPER END ⬆️ */}

        <h2 style={{ fontSize: "42px", fontWeight: "800", color: "var(--text-white)", marginBottom: "20px", lineHeight: "1.2" }}>
          <span className="gold-text-accent">
            Earn in Dollars, Withdraw in Naira
          </span>
        </h2>
        <p style={{ color: "var(--text-slate)", fontSize: "16px", lineHeight: "1.6", marginBottom: "32px" }}>
          Why Global Earners Are Rushing to VELORA <br />
          Earn in Dollars: Get paid in USD, cash out straight to your Nigerian bank account. <br />
          Instant Welcome Bonus: Get ₦31,500 to ₦50,750 back to WITHDRAW immediately you register. <br />
          Urgent Loans: Borrow money to start or grow your business with zero collateral and no stress. 
        </p>
        <CTAButton styleOverrides={{ fontSize: "16px", padding: "16px 36px" }} />
      </section>

      {/* ⬇️ HARDCODED FLAT CARD SECTION: No more array mapping or loops ⬇️ */}
      <section style={{ width: "100%", maxWidth: "1000px", display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }}>
        
        {/* VISUAL CARD 1: WHATSAPP */}
        <div style={{ width: "100%", maxWidth: "1000px", background: "var(--bg-dark-card)", borderRadius: "12px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }} className="neon-border-glow">
          <div style={{ width: "100%", maxWidth: "500px", height: "250px", borderRadius: "8px", overflow: "hidden", background: "#1a102f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img 
              src="/flyer-whatsapp.png" 
              alt="WhatsApp Task Flyer" 
              style={{ width: "100%", height: "100%", objectFit: "contain" }} 
            />
          </div>
          <h4 className="gold-text-accent" style={{ fontSize: "18px", fontWeight: "700", margin: 0, textAlign: "center" }}>Post on WhatsApp Status (Earn Up to ₦125k Daily)</h4>
          <p style={{ color: "var(--text-slate)", fontSize: "14px", lineHeight: "1.6", margin: 0, maxWidth: "600px", textAlign: "center" }}>What to do Download the AI music videos on the platform. Action: Post them on your WhatsApp Status. Payment : Get paid based on your views and consistency.</p>
        </div>

        {/* VISUAL CARD 2: LOANS */}
     <div style={{ width: "100%", maxWidth: "1000px", background: "var(--bg-dark-card)", borderRadius: "12px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }} className="neon-border-glow">
          <div style={{ width: "100%", maxWidth: "500px", height: "250px", borderRadius: "8px", overflow: "hidden", background: "#1a102f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img 
              src="/flyer-loann.png" 
              alt="Business Loan Flyer" 
              style={{ width: "100%", height: "100%", objectFit: "contain" }} 
            />
          </div>
          <h4 className="gold-text-accent" style={{ fontSize: "18px", fontWeight: "700", margin: 0, textAlign: "center" }}>Get Quick Business Loans</h4>
          <p style={{ color: "var(--text-slate)", fontSize: "14px", lineHeight: "1.6", margin: 0, maxWidth: "600px", textAlign: "center" }}>What to do: Apply inside the app. Action: No heavy paper, no guarantor, no headache.  Payment : Get fast cash credited to expand your business.</p>
        </div>

        {/* VISUAL CARD 3: WATCH VIDEOS */}
        <div style={{ width: "100%", maxWidth: "1000px", background: "var(--bg-dark-card)", borderRadius: "12px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }} className="neon-border-glow">
          <div style={{ width: "100%", maxWidth: "500px", height: "250px", borderRadius: "8px", overflow: "hidden", background: "#1a102f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img 
              src="/flyer-video.png" 
              alt="Video Rating Flyer" 
              style={{ width: "100%", height: "100%", objectFit: "contain" }} 
            />
          </div>
          <h4 className="gold-text-accent" style={{ fontSize: "18px", fontWeight: "700", margin: 0, textAlign: "center" }}>Watch & Rate Videos (Earn ₦10k – ₦20k Daily)</h4>
          <p style={{ color: "var(--text-slate)", fontSize: "14px", lineHeight: "1.6", margin: 0, maxWidth: "600px", textAlign: "center" }}>What to do: Watch one short AI video daily. Action: Just give it a star rating. Payment : Make ₦10,000 to ₦20,000 every day.</p>
        </div>

      </section>

      {/* Product Packaging Price Matrix Grid */}
      <section style={{ width: "100%", maxWidth: "900px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "32px", marginTop: "20px" }}>
        <PackageCard 
          planType="Platinum" 
          cost={9000} 
          initialBalance={31500} 
          features={platinumFeatures} 
          onSelectPlan={(plan) => onNavigate("AUTH", plan)} 
        />
        <PackageCard 
          planType="Gold" 
          cost={14500} 
          initialBalance={50750} 
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

