import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import PricingNote from './PricingNote';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } }
};
const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
};

const HERO_BG =
  "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2574&auto=format&fit=crop";

interface Props {
  onOpenSample: () => void;
}

export default function Hero({ onOpenSample }: Props) {
  return (
    <section
      className="relative w-full min-h-[60vh] md:min-h-[75vh] flex flex-col justify-center bg-cover bg-center"
      style={{ backgroundImage: `url("${HERO_BG}")` }}
    >
      {/* Dark tint overlay */}
      <div className="absolute inset-0 bg-[#001e40]/60" />

      {/* Content */}
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        variants={container}
        className="relative z-10 max-w-[1200px] mx-auto w-full px-5 md:px-lg pt-24 md:pt-32 pb-lg md:pb-xl flex flex-col gap-sm md:gap-md"
      >
        
        {/* Headline — max-w-[672px] avoids Tailwind v4 spacing token collision (max-w-2xl would be 64px) */}
        <motion.h1 
          variants={item}
          className="font-display-lg text-[2rem] leading-tight md:text-display-lg text-white max-w-[672px]"
        >
          The Philippines,<br />Perfectly Planned.
        </motion.h1>

        {/* Body — max-w-[576px] avoids Tailwind v4 spacing token collision (max-w-xl would be 64px) */}
        <motion.p 
          variants={item}
          className="font-body-lg text-[0.95rem] leading-6 md:text-body-lg text-white/80 max-w-[576px]"
        >
          Stop scrolling through endless blogs. Get a custom, day-by-day itinerary that balances iconic spots with hidden local gems—all routed for maximum island time.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          variants={item}
          className="flex flex-col sm:flex-row gap-4 mt-2 items-center"
        >
          <Link
            to="/plan"
            className="w-full sm:w-auto font-label-md text-label-md px-6 py-3 md:px-8 md:py-4 rounded-xl bg-secondary text-on-secondary hover:bg-secondary/90 transition-all duration-300 shadow-[0_8px_20px_rgba(0,51,102,0.15)] active:scale-[0.98] border-t border-white/20 flex items-center justify-center gap-2 group"
          >
            Start Your Journey
            <span
              className="material-symbols-outlined group-hover:translate-x-1 transition-transform"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              arrow_forward
            </span>
          </Link>
          <button 
            onClick={onOpenSample}
            className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/60 text-white font-label-md text-label-md px-6 py-3 md:px-8 md:py-4 rounded-xl hover:bg-white/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            Preview Sample Itinerary
          </button>
        </motion.div>

        {/* Pricing Note */}
        <motion.div variants={item} className="mt-1 flex justify-center sm:justify-start">
          <PricingNote />
        </motion.div>
      </motion.div>
    </section>
  );
}
