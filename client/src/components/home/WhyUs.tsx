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

export default function WhyUs() {
  return (
    <section id="why-us" className="w-full max-w-[1200px] mx-auto px-5 md:px-lg py-xl">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      >
        {/* Section header */}
        <motion.div variants={item} className="text-center mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">
            Why Tuklas?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[672px] mx-auto">
            Beyond standard bookings, we offer intelligent curation designed for
            the modern traveler seeking seamless archipelago exploration.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* Card 1 — Wide (Intelligent Island Routing) */}
        <motion.div variants={item} className="md:col-span-2 bg-surface rounded-3xl p-lg shadow-[0_8px_20px_rgba(0,51,102,0.08)] border border-surface-variant group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="bg-primary-container text-on-primary-container w-12 h-12 rounded-xl flex items-center justify-center mb-md">
            <span
              className="material-symbols-outlined fill"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              route
            </span>
          </div>
          <h3 className="font-headline-md text-headline-md text-primary mb-2">
            Intelligent Island Routing
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant relative z-10">
            No more 12-hour transit nightmares. We optimize every path based on
            real-world ferry and flight proximity, ensuring you spend less time
            waiting and more time exploring.
          </p>
        </motion.div>

        {/* Card 2 — The Perfect Blend */}
        <motion.div variants={item} className="bg-surface rounded-3xl p-lg shadow-[0_8px_20px_rgba(0,51,102,0.08)] border border-surface-variant group hover:-translate-y-1 transition-all duration-300">
          <div className="bg-secondary-container text-on-secondary-container w-12 h-12 rounded-xl flex items-center justify-center mb-md">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          </div>
          <h3 className="font-headline-md text-headline-md text-primary mb-2">
            The Perfect Blend
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            We pair the "must-sees" with the "only-locals-know" spots for an
            authentic archipelago experience.
          </p>
        </motion.div>

        {/* Card 3 — Expert Local Intel */}
        <motion.div variants={item} className="bg-surface rounded-3xl p-lg shadow-[0_8px_20px_rgba(0,51,102,0.08)] border border-surface-variant group hover:-translate-y-1 transition-all duration-300">
          <div className="bg-tertiary-container text-on-tertiary-container w-12 h-12 rounded-xl flex items-center justify-center mb-md">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_florist
            </span>
          </div>
          <h3 className="font-headline-md text-headline-md text-primary mb-2">
            Expert Local Intel
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            From transit hacks to the best 'Pasalubong' guides, we give you the
            local edge.
          </p>
        </motion.div>

        {/* Card 4 — Wide Dark (Island-Proof Access) */}
        <motion.div variants={item} className="md:col-span-2 bg-primary text-on-primary rounded-3xl p-lg shadow-[0_12px_24px_rgba(0,51,102,0.15)] border border-primary-fixed-dim/20 relative overflow-hidden flex flex-col justify-center">
          <div
            className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD0cnivLJv1IP8qjNzHoZMDU6k6TV_hfGwUPUC2SyhwijvAOojef8tSwr_NRjb1EOJ-m0Fb09zXXBJSyOVK0AkxgFK6KFHdIaScd0EHmDSe6RuJBqIQd3r2DXiMpOK_bHXFjO3eW12cwlxd2Cu_HVzOYqmn3u8VaAxRBVD8xBXnkGIAgkeptEIMdjfkUDOZHIWWrmvYMQTnXXAZveyyq_cen1wv475QcZYIm-HyteOt_H1LYW85yyci2s8zUtD-Errhh6bo-HINLUAR')",
            }}
          />
          <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-r from-primary via-primary/90 to-transparent" />
          <div className="relative z-10 max-w-[448px]">
            <div className="bg-on-primary/10 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center mb-md border border-on-primary/10">
              <span
                className="material-symbols-outlined text-on-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                route
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-primary mb-2">
              Seamless Logistics
            </h3>
            <p className="font-body-md text-body-md text-on-primary/80">
              We untangle complex ferry schedules, flight connections, and land transfers so you can focus on the journey, not the logistics.
            </p>
          </div>
        </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
