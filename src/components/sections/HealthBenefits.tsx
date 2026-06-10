import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const benefits = [
  {
    icon: '❤️',
    title: 'Heart Health',
    description: 'Omega-3 rich flax and sunflower seeds support healthy cholesterol and cardiovascular function.',
    color: 'from-red-500/20 to-red-900/5',
    border: 'hover:border-red-400/40',
    glow: 'rgba(239,68,68,0.25)',
    stat: 'Omega-3 Rich',
  },
  {
    icon: '🛡️',
    title: 'Immunity',
    description: 'Natural antioxidants from ginger, pepper, and cardamom strengthen your body\'s defences.',
    color: 'from-blue-500/20 to-blue-900/5',
    border: 'hover:border-blue-400/40',
    glow: 'rgba(59,130,246,0.25)',
    stat: 'Antioxidant Packed',
  },
  {
    icon: '🌿',
    title: 'Digestive Health',
    description: 'Cumin, ajwain, and fenugreek are time-tested Ayurvedic digestive aids for gut wellness.',
    color: 'from-green-500/20 to-green-900/5',
    border: 'hover:border-green-400/40',
    glow: 'rgba(34,197,94,0.25)',
    stat: 'Ayurvedic Blend',
  },
  {
    icon: '⚡',
    title: 'Natural Energy',
    description: 'Dates and seeds provide sustained energy from whole foods — no crash, no compromise.',
    color: 'from-yellow-500/20 to-yellow-900/5',
    border: 'hover:border-yellow-400/40',
    glow: 'rgba(234,179,8,0.25)',
    stat: 'Zero Stimulants',
  },
];

export function HealthBenefits() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: '-60px' });

  return (
    <section id="benefits" className="relative bg-[#0F172A] py-24 px-4 overflow-hidden" aria-label="Health benefits">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(46,125,50,0.12)_0%,transparent_60%)] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(124,255,178,0.07)_0%,transparent_60%)] pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-6xl">
        <motion.div
          ref={headingRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 text-accent-glow font-body text-sm font-semibold tracking-widest uppercase mb-4">
            <span className="w-6 h-px bg-accent-glow/60" />
            Wellness First
            <span className="w-6 h-px bg-accent-glow/60" />
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-neutral-cream mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] to-[#7CFFB2]">ARF?</span>
          </h2>
          <p className="font-body text-neutral-cream/60 max-w-xl mx-auto text-base leading-relaxed">
            Every ingredient is chosen for its proven health benefit — backed by Ayurveda and modern nutrition science.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <motion.article
              key={b.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 + i * 0.12 }}
              className={`relative flex flex-col items-center text-center p-7 rounded-2xl h-full
                bg-gradient-to-b ${b.color}
                backdrop-blur-md border border-white/10 ${b.border}
                transition-all duration-300 group cursor-default`}
              whileHover={{ scale: 1.04, boxShadow: `0 0 32px ${b.glow}` }}
              aria-label={b.title}
            >
              {/* Floating icon */}
              <motion.span
                className="text-5xl mb-5 block select-none"
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                role="img"
                aria-label={b.title}
              >
                {b.icon}
              </motion.span>

              <h3 className="font-heading font-semibold text-neutral-cream text-lg mb-2">{b.title}</h3>
              <p className="font-body text-sm text-neutral-cream/60 leading-relaxed mb-4">{b.description}</p>

              {/* Stat badge */}
              <span className="mt-auto inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent-glow text-xs font-body">
                {b.stat}
              </span>

              {/* Bottom glow line */}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-accent-glow rounded-full group-hover:w-2/3 transition-all duration-500" aria-hidden="true" />
            </motion.article>
          ))}
        </div>

        {/* Bottom trust strip */}
        <motion.div
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-neutral-cream/40 text-sm font-body"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {['No Artificial Colours', 'No Preservatives', 'No Added Sugar', 'Lab Tested'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="text-accent-glow">✓</span> {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HealthBenefits;
