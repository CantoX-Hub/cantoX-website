import Hero from "./component/landing/Hero";
import HowItWorks from "./component/landing/HowItWorks";
import Navbar from "./component/layout/Navbar";


export default function Home() {
  return (
    <main className="min-h-screen font-['Inter',sans-serif]">
      <Navbar />
      <Hero />
      <HowItWorks/>
      
    </main>
  );
}