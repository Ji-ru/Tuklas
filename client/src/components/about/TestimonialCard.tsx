import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { trustData } from '../../lib/trustData';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } }
};

const item: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
};

export default function TestimonialCard() {
  const { title, quote, author, bio } = trustData.founderStory;

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="mt-xl px-5 md:px-lg max-w-[1200px] mx-auto w-full"
    >
      <motion.div 
        variants={item}
        className="bg-primary text-on-primary rounded-2xl p-6 md:p-lg shadow-[0_12px_40px_rgba(0,51,102,0.12)] relative overflow-hidden flex flex-col md:flex-row items-center gap-md"
      >
        {/* Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-primary opacity-60 pointer-events-none" />

        {/* Left Column: Icon/Logo styling */}
        <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0 relative z-10 shadow-md">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            tour
          </span>
        </div>

        {/* Right Column: Quote content */}
        <div className="space-y-4 relative z-10 text-center md:text-left flex-grow">
          <h3 className="font-label-md text-label-md text-on-primary/80 tracking-wider uppercase">
            {title}
          </h3>
          <p className="font-headline-md text-headline-sm md:text-headline-md text-on-primary italic font-medium leading-relaxed">
            "{quote}"
          </p>
          <div className="border-t border-on-primary/20 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <div>
              <p className="font-label-md text-label-md text-on-primary font-bold">{author}</p>
              <p className="font-body-sm text-sm text-on-primary/80">{bio}</p>
            </div>
            <span className="bg-on-primary/10 backdrop-blur-sm px-4 py-1.5 rounded-full font-label-sm text-label-sm text-on-primary border border-on-primary/10">
              Founder's Story
            </span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
