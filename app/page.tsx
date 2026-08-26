import Hero from "./component/landing/Hero";
import Navbar from "./component/layout/Navbar";


export default function Home() {
  return (
    <main className="min-h-screen font-['Inter',sans-serif]">
      <Navbar />
      <Hero />
      
    </main>
  );
}