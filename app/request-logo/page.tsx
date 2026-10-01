import HappyCouple from "../component/landing/HappyCouple";
import Footer from "../component/layout/Footer";
import PageHeroBanner from "../component/layout/PageHero";
import RequestForm from "../component/request-logo/RequestForm";
import UniqueLogos from "../component/request-logo/UniqueLogos";


export default function RequestLogoPage() {
  return (
    <main className="min-h-screen">
      <PageHeroBanner
        title="Request Logo"
        description="Behind every seamless wedding is a planner who had the right tools. Now you have them."
        backgroundImage="/page-hero-banner.png"
      />
      <RequestForm/>
      <UniqueLogos/>
      <HappyCouple/>
      <Footer/>
    </main>
  );
}