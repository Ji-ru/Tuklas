import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { trustData } from '../../lib/trustData';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function TrustSection() {
  const { title, subtitle, paragraphs } = trustData.methodology;

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="mt-xl px-5 md:px-lg max-w-[1200px] mx-auto w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md bg-surface-container-low border border-surface-variant/40 rounded-2xl p-6 md:p-lg shadow-[0_8px_24px_rgba(0,51,102,0.06)] relative overflow-hidden">
        
        {/* Left Column: Heading */}
        <motion.div variants={item} className="md:col-span-1 space-y-3">
          <span className="font-label-md text-label-md text-secondary tracking-widest uppercase block">
            Our Methodology
          </span>
          <h2 className="font-display-md text-headline-lg md:text-headline-md text-primary leading-tight font-extrabold">
            {title}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            {subtitle}
          </p>
          <div className="hidden md:block w-16 h-[3px] bg-secondary rounded-full mt-4" />
        </motion.div>

        {/* Right Column: Content */}
        <motion.div variants={item} className="md:col-span-2 space-y-5">
          {paragraphs.map((paragraph, idx) => {
            const isDisclaimer = idx === paragraphs.length - 1;

            if (isDisclaimer) {
              return (
                <div 
                  key={idx} 
                  className="bg-error-container/20 border-l-4 border-error text-on-error-container p-4 rounded-r-lg font-body-sm text-body-sm leading-relaxed flex gap-3 mt-4"
                >
                  <span className="material-symbols-outlined text-[20px] text-error flex-shrink-0">warning</span>
                  <div>
                    <span className="font-bold text-primary">Schedule Volatility Note:</span> {paragraph}
                  </div>
                </div>
              );
            }

            return (
              <p key={idx} className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </motion.div>

      </div>
    </motion.section>
  );
}
