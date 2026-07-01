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

const PROBLEM_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBlVqSrh4xhjuGosHY8lVSR1a52nqjinRXYdyVPajzryYb3uy-p6FLtVm4iwAsTS1nEifkcryYgTUYijKlJrLbmibQqPRZM-YzEGB8Vxgt099vWVMZXJTAmZe3ycP_ErWdtTrWvvlJx1rW_pETmo_6B3mDHy7xjYgJrJPh1wbBLOflT1eqPgsHUi_Pjb_QkP5iwwVQjmUPjPxld-DLD0yZMxiCVYJpxhPStO1TYLWwJGa3_cT0xtsnz7z9rRTcEJO82cJVxe0yU0oXU';

export default function ProblemSolution() {
  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-md mt-xl px-5 md:px-lg max-w-[1200px] mx-auto w-full"
    >
      {/* The Problem Card */}
      <motion.div variants={item} className="bg-surface-container-low p-md rounded-xl shadow-[0_8px_20px_rgba(0,51,102,0.08)] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={PROBLEM_IMG}
            alt="Chaotic travel terminal"
            className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="w-12 h-12 bg-error-container text-on-error-container rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-primary">The Problem</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Planning a trip to the Philippines shouldn't feel like a second job. Between conflicting travel blogs, navigating complex ferry schedules, and the constant fear of missing out on the 'real' Philippines, most travelers end up exhausted before they even land. We saw too many people spending more time in transit hubs than on white-sand beaches.
          </p>
        </div>
      </motion.div>

      {/* Our Solution Card */}
      <motion.div variants={item} className="bg-primary text-on-primary p-md rounded-xl shadow-[0_8px_20px_rgba(0,51,102,0.08)] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-container to-primary opacity-80" />
        <div className="relative z-10 space-y-4">
          <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-secondary-fixed">Our Solution</h2>
          <p className="font-body-md text-body-md text-on-primary/90 leading-relaxed">
            Tuklas was born from a simple idea: combine deep local knowledge with smart technology. We've mapped the archipelago's logistics so you don't have to. Our assistant isn't just a generator; it's a digital local expert that understands the rhythm of the islands, ensuring your travel is seamless, stress-free, and spectacular.
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}
