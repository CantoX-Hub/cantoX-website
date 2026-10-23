import HappyCouple from "../component/landing/HappyCouple";
import Footer from "../component/layout/Footer";
import PageHeroBanner from "../component/layout/PageHero";
import ChoosePlan from "../component/Pricing/Plan";


export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <PageHeroBanner
        eyebrow="Pricing"
        title={
          <>
            Simple pricing, tailored to you.
            <br />
           Find a plan for your dream wedding.
          </>
        }
      />
      <ChoosePlan/>
      <HappyCouple/>
      <Footer/>
    </main>
  );
}