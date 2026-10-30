import HappyCouple from "../component/landing/HappyCouple";
import MoreWithCanto from "../component/landing/MoreWithCanto";
import Templates from "../component/landing/TemplatesDesign";
import Footer from "../component/layout/Footer";
import PageHeroBanner from "../component/layout/PageHero";


export default function TemplatesPage() {
  return (
    <main className="min-h-screen">
      <PageHeroBanner
        eyebrow="Templates"
        title="Behind every seamless wedding is a planner who had the right tools. Now you have them."
      />
      <Templates/>
      <MoreWithCanto/>
      <HappyCouple/>
      <Footer/>
    </main>
  );
}