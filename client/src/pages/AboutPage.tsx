import AboutHero from '../components/about/AboutHero';
import ProblemSolution from '../components/about/ProblemSolution';
import TrustSection from '../components/about/TrustSection';
import OurPromise from '../components/about/OurPromise';
import TestimonialCard from '../components/about/TestimonialCard';
import AboutCTA from '../components/about/AboutCTA';

export default function AboutPage() {
  return (
    <div className="flex flex-col pb-24 md:pb-0 pt-24">
      <div className="max-w-[1200px] mx-auto w-full space-y-0">
        <AboutHero />
        <ProblemSolution />
        <TrustSection />
        <OurPromise />
        <TestimonialCard />
        <AboutCTA />
      </div>
      {/* Spacer for footer */}
      <div className="h-xl" />
    </div>
  );
}
