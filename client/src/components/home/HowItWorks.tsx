import { Link } from 'react-router-dom';
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

const steps = [
  {
    num: '1',
    active: true,
    icon: 'map',
    title: 'Choose Your Archipelago',
    body: "Pick between Luzon's highlands, Visayas' beaches, or Mindanao's raw beauty.",
  },
  {
    num: '2',
    active: false,
    icon: 'favorite',
    title: 'Set Your Pulse',
    body: 'Tell us your budget, travel pace, and what you love (Food, Adventure, or Relaxation).',
  },
  {
    num: '3',
    active: false,
    icon: 'task',
    title: 'Get Your Masterplan',
    body: 'Receive an instant, fully-routed itinerary ready for your next flight.',
  },
];

interface Props {
  onOpenSample: () => void;
}

export default function HowItWorks({ onOpenSample }: Props) {
  return (
    <section id="how-it-works" className="w-full max-w-[1200px] mx-auto px-5 md:px-lg py-xl overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      >
        {/* Header */}
        <motion.div variants={item} className="text-center mb-xl">
          <span className="font-label-md text-label-md text-secondary tracking-widest uppercase mb-2 block">The Process</span>
          <h2 className="font-headline-lg text-headline-lg text-primary">Curated in 3 Steps</h2>
        </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Connecting line */}
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8 } } }} className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-surface-variant -translate-y-1/2 z-0" />
        <motion.div variants={{ hidden: { opacity: 0, scaleX: 0 }, show: { opacity: 1, scaleX: 1, transition: { duration: 1, ease: "easeOut" } } }} style={{ transformOrigin: "left" }} className="hidden md:block absolute top-1/2 left-0 w-1/3 h-1 bg-secondary -translate-y-1/2 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg relative z-10">
          {steps.map((step) => (
            <motion.div
              variants={item}
              key={step.num}
              className="bg-surface rounded-2xl p-md shadow-[0_8px_20px_rgba(0,51,102,0.08)] flex flex-col items-center text-center relative mt-8 md:mt-0"
            >
              {/* Step number circle */}
              <div
                className={`absolute -top-6 w-12 h-12 rounded-full flex items-center justify-center font-headline-md font-bold border-4 border-surface ${
                  step.active
                    ? 'bg-secondary text-on-secondary shadow-[0_4px_12px_rgba(0,109,61,0.2)]'
                    : 'bg-surface-variant text-on-surface shadow-sm'
                }`}
              >
                {step.num}
              </div>

              {/* Icon */}
              <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-4 mt-6">
                <span
                  className="material-symbols-outlined text-4xl text-primary"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  {step.icon}
                </span>
              </div>

              <h3 className="font-headline-md text-headline-md text-primary mb-2">{step.title}</h3>
              {step.num === '3' ? (
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {step.body}{' '}
                  <button 
                    onClick={onOpenSample}
                    className="text-primary hover:text-secondary font-bold underline inline-block ml-1 cursor-pointer bg-transparent border-none p-0"
                  >
                    (See what this looks like)
                  </button>
                </p>
              ) : (
                <p className="font-body-md text-body-md text-on-surface-variant">{step.body}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div variants={item} className="flex justify-center mt-xl">
        <Link
          to="/plan"
          className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-[0_8px_20px_rgba(0,51,102,0.15)] active:scale-[0.98] border-t border-white/20 inline-block"
        >
          Create Itinerary
        </Link>
      </motion.div>
      </motion.div>
    </section>
  );
}
