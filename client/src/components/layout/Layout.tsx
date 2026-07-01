import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import ScrollFloaters from './ScrollFloaters';
import SampleItineraryPreview from '../home/SampleItineraryPreview';

export type OutletContextType = {
  onOpenSample: () => void;
  setFloatersHidden: (hidden: boolean) => void;
};

export default function Layout() {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const [isSampleOpen, setIsSampleOpen] = useState(false);
  const [isFloatersHidden, setIsFloatersHidden] = useState(false);

  return (
    <div className="flex flex-col min-h-[100dvh] relative">
      <Header />
      <main className="flex-grow flex flex-col relative z-0">
        <Outlet context={{ onOpenSample: () => setIsSampleOpen(true), setFloatersHidden: setIsFloatersHidden } as OutletContextType} />
      </main>
      {/* Footer hidden on mobile — MobileNav serves as bottom nav on small screens */}
      <div className="hidden md:block">
        {!isChatPage && <Footer />}
      </div>
      <MobileNav />
      <ScrollFloaters onOpenSample={() => setIsSampleOpen(true)} hideFloaters={isFloatersHidden} />
      <SampleItineraryPreview isOpen={isSampleOpen} onClose={() => setIsSampleOpen(false)} />
    </div>
  );
}
