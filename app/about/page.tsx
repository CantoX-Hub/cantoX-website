import ChapterSection from "../component/about-us/ChapterSection";
import HowCantoWorks from "../component/about-us/HowCantoWorks";
import OnePlatform from "../component/about-us/OnePlatform";
import PlanningSection from "../component/about-us/PlanningSection";
import PrincipleSection from "../component/about-us/PrincipleSection";
import ReadyToStart from "../component/about-us/StartYourJourney";
import HappyCouple from "../component/landing/HappyCouple";
import Footer from "../component/layout/Footer";
import PageHeroBanner from "../component/layout/PageHero";


export default function AboutPage() {
  return (
    <main className="min-h-screen">
       <PageHeroBanner
        eyebrow="About us"
        title={
          <>
            Every life has a Canto[Chapters]
            <br />
            We built the place to experience yours
          </>
        }
      />
      <ChapterSection/>
      <HowCantoWorks/>
      <PlanningSection/>
      <OnePlatform/>
      <PrincipleSection/>
      <ReadyToStart/>
      <HappyCouple/>
      <Footer/>
    </main>
  );
}