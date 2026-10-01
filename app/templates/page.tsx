import HappyCouple from "../component/landing/HappyCouple";
import MoreWithCanto from "../component/landing/MoreWithCanto";
import SignatureSection from "../component/landing/Signature";
import Templates from "../component/landing/TemplatesDesign";
import Footer from "../component/layout/Footer";
import PageHeroBanner from "../component/layout/PageHero";


export default function TemplatesPage() {
  return (
    <main className="min-h-screen">
      <PageHeroBanner
        title="Templates"
        description="Behind every seamless wedding is a planner who had the right tools. Now you have them."
        backgroundImage="/page-hero-banner.png"
      />
      <Templates/>
      <MoreWithCanto/>
      <SignatureSection/>
      <HappyCouple/>
      <Footer/>
    </main>
  );
}