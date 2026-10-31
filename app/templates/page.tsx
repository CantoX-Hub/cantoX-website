import HappyCouple from "../component/landing/HappyCouple";
import MoreWithCanto from "../component/landing/MoreWithCanto";
import Footer from "../component/layout/Footer";
import PageHeroBanner from "../component/layout/PageHero";
import TemplateCardDesign from "../component/TemplateCardLayout";

export default function TemplatesPage() {
  return (
    <main className="min-h-screen">
      <PageHeroBanner
        eyebrow="Templates"
        title="Behind every seamless wedding is a planner who had the right tools. Now you have them."
      />
      <TemplateCardDesign/>
      <MoreWithCanto/>
      <HappyCouple/>
      <Footer/>
    </main>
  );
}