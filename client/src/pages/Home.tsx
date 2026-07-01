import { useOutletContext } from 'react-router-dom';
import Hero from '../components/home/Hero';
import WhyUs from '../components/home/WhyUs';
import HowItWorks from '../components/home/HowItWorks';
import StatsBar from '../components/home/StatsBar';
import FAQSection from '../components/home/FAQSection';

export default function Home() {
  const { onOpenSample } = useOutletContext<{ onOpenSample: () => void }>();

  return (
    <div className="flex flex-col pb-24 md:pb-0">
      <Hero onOpenSample={onOpenSample} />
      <StatsBar />
      <WhyUs />
      <HowItWorks onOpenSample={onOpenSample} />
      <FAQSection />
    </div>
  );
}
