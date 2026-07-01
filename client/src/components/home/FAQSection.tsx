import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqData } from '../../lib/faqData';

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="w-full max-w-[800px] mx-auto px-5 md:px-lg py-lg md:py-xl">
      <div className="text-center mb-lg md:mb-xl">
        <span className="font-label-md text-label-md text-secondary tracking-widest uppercase mb-2 block">
          Got Questions?
        </span>
        <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary">
          Frequently Asked Questions
        </h2>
      </div>

      {/* Scrollable Container */}
      <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 pb-2">
        {faqData.map((item, idx) => {
          const isOpen = activeIndex === idx;

          return (
            <div 
              key={idx}
              className="bg-surface rounded-xl border border-surface-variant/60 shadow-sm overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left font-headline-sm text-base md:text-[17px] font-bold text-primary gap-4 hover:bg-surface-container-low transition-colors"
              >
                <span>{item.question}</span>
                <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180 text-secondary' : ''}`}>
                  expand_more
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1, transition: { height: { duration: 0.25 }, opacity: { duration: 0.2 } } }}
                    exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.2 }, opacity: { duration: 0.15 } } }}
                  >
                    <div className="px-5 pb-4 pt-0 font-body-md text-sm text-on-surface-variant leading-relaxed border-t border-surface-variant/30 mt-1">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
