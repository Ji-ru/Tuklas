import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } }
};
const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
};

export default function AboutHero() {
  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="text-center max-w-[768px] mx-auto space-y-6 pt-lg px-5 md:px-lg"
    >
      <motion.h1 variants={item} className="font-display-lg text-[2rem] md:text-display-lg text-primary tracking-tight leading-tight">
        Our Mission: To Make Every Island Moment Count.
      </motion.h1>
      <motion.p variants={item} className="font-body-lg text-body-lg text-on-surface-variant">
        Curated serenity in the archipelago, designed for the modern explorer seeking elite tropical discovery. Founded by passionate travelers who spent years navigating ferry terminals and outrigger boat schedules, Tuklas simplifies Philippine travel logistics so you can focus on the adventure.
      </motion.p>
    </motion.section>
  );
}
