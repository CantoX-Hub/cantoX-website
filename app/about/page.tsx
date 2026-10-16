import HappyCouple from "../component/landing/HappyCouple";
import Footer from "../component/layout/Footer";
import PageHeroBanner from "../component/layout/PageHero";


export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <PageHeroBanner
                    eyebrow="About us"
                    title="Every life has a Canto[Chapters]
We built the place to experience yours"
                  />
      <Footer/>
    </main>
  );
}