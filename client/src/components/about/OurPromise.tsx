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

const promises = [
  {
    icon: 'verified',
    iconBg: 'bg-tertiary-fixed-dim/20 text-tertiary',
    title: 'Unfiltered Authenticity',
    body: "We only recommend spots we'd send our own families to.",
  },
  {
    icon: 'route',
    iconBg: 'bg-primary-fixed-dim/20 text-primary-container',
    title: 'Logistical Precision',
    body: 'Every route is vetted for feasibility, not just distance.',
  },
  {
    icon: 'favorite',
    iconBg: 'bg-secondary-container/30 text-secondary',
    title: 'The Soul of the Philippines',
    body: 'We prioritize experiences that support local communities and showcase our true culture.',
  },
];

export default function OurPromise() {
  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="mt-xl px-5 md:px-lg max-w-[1200px] mx-auto w-full space-y-lg"
    >
      <motion.div variants={item} className="text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary">Our Promise</h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {promises.map((p) => (
          <motion.div
            variants={item}
            key={p.title}
            className="bg-surface p-md rounded-xl shadow-[0_8px_20px_rgba(0,51,102,0.08)] border border-surface-variant hover:shadow-[0_12px_40px_rgba(0,51,102,0.12)] transition-shadow duration-300 text-center space-y-4"
          >
            <div className={`mx-auto w-16 h-16 ${p.iconBg} rounded-full flex items-center justify-center`}>
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {p.icon}
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">{p.title}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
