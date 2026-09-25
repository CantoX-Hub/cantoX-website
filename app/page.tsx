import HappyCouple from "./component/landing/HappyCouple";
import Hero from "./component/landing/Hero";
import HowItWorks from "./component/landing/HowItWorks";
import MoreWithCanto from "./component/landing/MoreWithCanto";
import SignatureSection from "./component/landing/Signature";
import Templates from "./component/landing/TemplatesDesign";
import Navbar from "./component/layout/Navbar";


export default function Home() {
  return (
    <main className="min-h-screen font-['Inter',sans-serif]">
      <Navbar />
      <Hero />
      <HowItWorks/>
      <Templates/>
      <MoreWithCanto/>
      <SignatureSection/>
      <HappyCouple/>
    </main>
  );
}