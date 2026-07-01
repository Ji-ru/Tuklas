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

const CTA_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCie-rmslHyBMiIOKDtkyFeY4nt2BplDNnfK1KLz_1uG8-kq1_SSrZW3k_9oYU-nZoomuOZVKWzPfZTgbS__r5DFMESgmXilisO055aAsaP30bfZ8JNwxoaiIeOtRmp5bf3PDRNgmeim8RnfV6f4DfmSYR1z1MY2HxeWqat0D4tpYdTNZvEMhljJKBK9Bu1BUKThCwswzluv2TlY4hlWDPPIHQjQ0hO9ATo5vXu_UHCdqpU7A2ULPBgKdlNMJQRCqbd-DCNiSeMpzSW';

export default function AboutCTA() {
  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="mt-xl px-5 md:px-lg max-w-[1200px] mx-auto w-full"
    >
      <motion.div variants={item} className="relative rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,51,102,0.12)]">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={CTA_IMG} alt="Pristine Philippine beach" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/70 backdrop-blur-sm" />
        </div>

        {/* Content */}
        <div className="relative z-10 py-xl px-5 text-center space-y-8 flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="font-display-lg text-[2rem] md:text-display-lg text-on-primary max-w-[672px] leading-tight">
            Ready to see the islands through a local's eyes?
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary/90">
            Let's build your first itinerary together.
          </p>
          <Link
            to="/plan"
            className="bg-secondary text-on-secondary font-label-md text-label-md px-8 py-4 rounded-full hover:scale-95 transition-all duration-200 shadow-lg border-t border-white/20 inline-block"
          >
            Start Planning
          </Link>
        </div>
      </motion.div>
    </motion.section>
  );
}
