import HappyCouple from "../component/landing/HappyCouple";
import Footer from "../component/layout/Footer";
import PageHeroBanner from "../component/layout/PageHero";
import RequestForm from "../component/request-logo/RequestForm";
import UniqueLogos from "../component/request-logo/UniqueLogos";


export default function RequestLogoPage() {
  return (
    <main className="min-h-screen">
      
       <PageHeroBanner
              eyebrow="Logo request"
              title="You deserve an iconic identity for your special chapter, not the regular thing."
            />
      <RequestForm/>
      <UniqueLogos/>
      <HappyCouple/>
      <Footer/>
    </main>
  );
}