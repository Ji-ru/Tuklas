import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollFloaters({ onOpenSample, hideFloaters }: { onOpenSample: () => void, hideFloaters?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toggleVisibility = () => {
      // 400px roughly covers the hero section
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsMenuOpen(false); // Auto-close menu if we scroll to top
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    // Initial check
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Offset for sticky header
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Only hide on pages where it wouldn't make sense (like the chat interface)
  const isChatPage = pathname === '/chat';
  const isPlanPage = pathname === '/plan';
  const isHomePage = pathname === '/';

  return (
    <div 
      className={`fixed bottom-24 md:bottom-8 right-5 md:right-8 z-40 flex flex-col md:flex-row items-end gap-3 md:gap-4 transition-all duration-300 pointer-events-none ${
        isVisible && !hideFloaters ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Quick Navigation Menu Popover */}
      {!isChatPage && !isPlanPage && (
        <div className={`relative ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`} ref={menuRef}>
          <AnimatePresence>
            {isMenuOpen && isHomePage && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-[calc(100%+12px)] right-0 bg-surface rounded-2xl shadow-[0_8px_30px_rgba(0,51,102,0.12)] border border-outline-variant/30 p-2 min-w-[220px] flex flex-col gap-1 z-50 overflow-hidden"
              >
                <button onClick={() => scrollToId('why-us')} className="text-left px-4 py-3 hover:bg-surface-container rounded-lg font-label-md text-sm text-on-surface transition-colors flex items-center gap-3 group/item">
                  <span className="material-symbols-outlined text-[18px] text-primary/70 group-hover/item:text-primary transition-colors">info</span>
                  Why Tuklas?
                </button>
                <button onClick={() => scrollToId('how-it-works')} className="text-left px-4 py-3 hover:bg-surface-container rounded-lg font-label-md text-sm text-on-surface transition-colors flex items-center gap-3 group/item">
                  <span className="material-symbols-outlined text-[18px] text-primary/70 group-hover/item:text-primary transition-colors">route</span>
                  Curated in 3 Steps
                </button>
                <button onClick={() => scrollToId('faq')} className="text-left px-4 py-3 hover:bg-surface-container rounded-lg font-label-md text-sm text-on-surface transition-colors flex items-center gap-3 group/item">
                  <span className="material-symbols-outlined text-[18px] text-primary/70 group-hover/item:text-primary transition-colors">help</span>
                  FAQ
                </button>
                <div className="h-px bg-outline-variant/30 my-1 mx-2" />
                <button 
                  onClick={() => { onOpenSample(); setIsMenuOpen(false); }}
                  className="text-left px-4 py-3 hover:bg-primary-container text-primary font-bold rounded-lg font-label-md text-sm transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  Preview Sample
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => {
              if (isHomePage) {
                setIsMenuOpen(!isMenuOpen);
              } else {
                onOpenSample();
              }
            }}
            className="bg-surface text-primary shadow-lg border border-outline-variant/30 px-4 py-3 md:py-3.5 rounded-[10px] font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container transition-colors group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
              {isHomePage ? (isMenuOpen ? 'close' : 'explore') : 'visibility'}
            </span>
            {isHomePage ? 'Quick Nav' : 'Preview Sample'}
          </button>
        </div>
      )}

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`bg-primary text-on-primary w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-[10px] shadow-lg hover:bg-primary/90 transition-colors group flex-shrink-0 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <span className="material-symbols-outlined text-[24px] group-hover:-translate-y-1 transition-transform">arrow_upward</span>
      </button>
    </div>
  );
}
