import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function StatsBar() {
  const stats = [
    { value: '7,107', label: 'Archipelago Islands Mapped' },
    { value: '25+', label: 'Vetted Travel Regions' },
    { value: '12,450+', label: 'Custom Itineraries Built' },
  ];

  return (
    <div className="w-full bg-surface-container-low border-b border-surface-variant/40 py-6">
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-[1200px] mx-auto px-5 md:px-lg grid grid-cols-3 divide-x divide-outline-variant/30 text-center"
      >
        {stats.map((stat, idx) => (
          <motion.div variants={item} key={idx} className="flex flex-col items-center justify-center py-1 md:py-0">
            <span className="font-display-md text-xl md:text-headline-lg text-primary font-extrabold leading-none tracking-tight">
              {stat.value}
            </span>
            <span className="font-label-sm text-[10px] md:text-label-sm text-on-surface-variant tracking-wider uppercase mt-1">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
