import HappyCouple from "../component/landing/HappyCouple";
import MoreWithCanto from "../component/landing/MoreWithCanto";
import SignatureSection from "../component/landing/Signature";
import Templates from "../component/landing/TemplatesDesign";
import Footer from "../component/layout/Footer";
import PageHeroBanner from "../component/layout/PageHero";


export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <PageHeroBanner
        title="Pricing"
        description="Choose between a one-time payment for a single event or a subscription plan designed for event planners managing multiple events."
        backgroundImage="/page-hero-banner.png"
      />
      
      <HappyCouple/>
      <Footer/>
    </main>
  );
}