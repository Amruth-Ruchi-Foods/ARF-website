import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: string;
}

const TIMELINE_ITEMS: TimelineItem[] = [
  { year: '2018', icon: '🌱', title: 'Founded with a Vision',    description: 'Started with a mission to bring pure, natural foods to Indian households — no additives, no compromise.' },
  { year: '2019', icon: '🥛', title: 'First Product Launch',     description: 'Launched our signature Buttermilk Mix, inspired by traditional Ayurvedic recipes passed down generations.' },
  { year: '2021', icon: '🤝', title: 'Growing Community',        description: 'Reached 10,000+ happy customers across India, building trust one wholesome product at a time.' },
  { year: '2023', icon: '⚡', title: 'Expanding Range',          description: 'Introduced Energy Mixes and Healthy Snacks — fuelling active lifestyles with nature\'s best.' },
  { year: '2024', icon: '🌿', title: 'Pure Nutrition Mission',   description: 'Committed to zero artificial additives across all products. What you see is what you get.' },
];

const STATS = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '100%', label: 'Natural Ingredients' },
  { value: '0',    label: 'Artificial Additives' },
  { value: '6+',   label: 'Years of Trust' },
];

function TimelineEntry({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative mb-8 last:mb-0">

      {/* ── Mobile: single column, icon left + card right ── */}
      <div className="flex items-start gap-4 sm:hidden">
        <motion.div
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#0F172A] border-2 border-accent-glow shadow-[0_0_14px_rgba(124,255,178,0.45)] text-lg mt-1"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.15, type: 'spring', stiffness: 200 }}
          aria-hidden="true"
        >
          {item.icon}
        </motion.div>
        <motion.div
          className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:border-accent-glow/30 transition-colors duration-300"
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          <span className="block text-accent-glow font-heading font-bold text-lg mb-0.5">{item.year}</span>
          <h3 className="font-heading font-semibold text-neutral-cream text-sm mb-1.5">{item.title}</h3>
          <p className="font-body text-neutral-cream/60 text-sm leading-relaxed">{item.description}</p>
        </motion.div>
      </div>

      {/* ── Desktop: alternating left/right ── */}
      <div className="hidden sm:flex items-start justify-center">
        {/* Left content */}
        <motion.div
          className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'invisible'}`}
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          aria-hidden={!isLeft}
        >
          {isLeft && (
            <div className="inline-block bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-right hover:border-accent-glow/30 transition-colors duration-300">
              <span className="block text-accent-glow font-heading font-bold text-xl mb-1">{item.year}</span>
              <h3 className="font-heading font-semibold text-neutral-cream text-base mb-2">{item.title}</h3>
              <p className="font-body text-neutral-cream/60 text-sm leading-relaxed">{item.description}</p>
            </div>
          )}
        </motion.div>

        {/* Center node */}
        <motion.div
          className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#0F172A] border-2 border-accent-glow shadow-[0_0_16px_rgba(124,255,178,0.5)] text-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 200 }}
          aria-hidden="true"
        >
          {item.icon}
        </motion.div>

        {/* Right content */}
        <motion.div
          className={`w-5/12 ${!isLeft ? 'text-left pl-8' : 'invisible'}`}
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          aria-hidden={isLeft}
        >
          {!isLeft && (
            <div className="inline-block bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-left hover:border-accent-glow/30 transition-colors duration-300">
              <span className="block text-accent-glow font-heading font-bold text-xl mb-1">{item.year}</span>
              <h3 className="font-heading font-semibold text-neutral-cream text-base mb-2">{item.title}</h3>
              <p className="font-body text-neutral-cream/60 text-sm leading-relaxed">{item.description}</p>
            </div>
          )}
        </motion.div>
      </div>

    </div>
  );
}

export function BrandStory() {
  const headingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-60px' });
  const isStatsInView = useInView(statsRef, { once: true, margin: '-60px' });

  return (
    <section id="about" className="relative bg-[#0F172A] py-24 px-4 overflow-hidden" aria-label="Brand story">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(46,125,50,0.12)_0%,transparent_60%)] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(124,255,178,0.06)_0%,transparent_60%)] pointer-events-none" aria-hidden="true" />
      {/* Leaf accent */}
      <div className="absolute top-10 right-10 text-8xl opacity-5 select-none pointer-events-none" aria-hidden="true">🌿</div>
      <div className="absolute bottom-10 left-10 text-8xl opacity-5 select-none pointer-events-none" aria-hidden="true">🌱</div>

      <div className="container mx-auto max-w-4xl">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 text-accent-glow font-body text-sm font-semibold tracking-widest uppercase mb-4">
            <span className="w-6 h-px bg-accent-glow/60" />
            Our Journey
            <span className="w-6 h-px bg-accent-glow/60" />
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-neutral-cream mb-5">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] to-[#7CFFB2]">ARF</span> Story
          </h2>
          <p className="font-body text-neutral-cream/65 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Born from a simple belief — that nature provides everything we need to thrive.
            Our mission is to deliver pure, wholesome nutrition with zero compromise.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center p-4 rounded-2xl bg-white/[0.04] border border-white/10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4, type: 'spring' }}
            >
              <div className="font-heading font-bold text-2xl sm:text-3xl text-accent-glow">{s.value}</div>
              <div className="font-body text-xs text-neutral-cream/50 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative" role="list" aria-label="ARF brand milestones">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-glow/30 to-transparent -translate-x-1/2 hidden sm:block" aria-hidden="true" />
          {TIMELINE_ITEMS.map((item, index) => (
            <div key={item.year} role="listitem">
              <TimelineEntry item={item} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandStory;
