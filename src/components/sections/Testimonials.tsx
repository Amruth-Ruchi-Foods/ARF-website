import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getAllTestimonials } from '../../data/testimonials';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-[#FF9800]' : 'text-white/20'} aria-hidden="true">★</span>
      ))}
    </div>
  );
}

const all = getAllTestimonials();

function TestimonialCard({ t }: { t: (typeof all)[0] }) {
  return (
    <div className="flex-shrink-0 w-[300px] md:w-[340px] mx-3 p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <StarRating rating={t.rating} />
        <span className="font-body text-[10px] text-accent-glow/60 bg-accent-glow/10 px-2 py-0.5 rounded-full border border-accent-glow/20 truncate max-w-[120px]">{t.product}</span>
      </div>
      <p className="font-body text-sm text-neutral-cream/80 leading-relaxed flex-1">
        <span className="text-accent-glow/40 text-xl leading-none">"</span>
        {t.text}
        <span className="text-accent-glow/40 text-xl leading-none">"</span>
      </p>
      <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
        <div className="w-8 h-8 rounded-full bg-accent-glow/20 border border-accent-glow/40 flex items-center justify-center text-accent-glow font-heading font-bold text-sm flex-shrink-0">
          {t.author[0]}
        </div>
        <div>
          <p className="font-heading font-semibold text-neutral-cream text-xs">{t.author}</p>
          <p className="font-body text-neutral-cream/40 text-[10px]">{t.location} · Verified</p>
        </div>
      </div>
    </div>
  );
}

// Split into two rows for staggered effect
const row1 = all.slice(0, Math.ceil(all.length / 2));
const row2 = all.slice(Math.ceil(all.length / 2));

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative bg-[#0F172A] py-24 overflow-hidden"
      aria-label="Customer testimonials"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(46,125,50,0.12)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(124,255,178,0.05)_0%,transparent_60%)] pointer-events-none" />

      {/* Heading */}
      <motion.div
        className="text-center mb-12 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-2 text-accent-glow font-body text-sm font-semibold tracking-widest uppercase mb-4">
          <span className="w-6 h-px bg-accent-glow/60" />
          Real Stories
          <span className="w-6 h-px bg-accent-glow/60" />
        </span>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-cream mb-3">
          What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] to-[#7CFFB2]">Community</span> Says
        </h2>
        <p className="font-body text-neutral-cream/55 text-sm">50+ happy customers. Real results. Real nutrition.</p>
      </motion.div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#0F172A] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#0F172A] to-transparent" />

      {/* Row 1 — slides left */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex w-max" style={{ animation: 'slide-left 80s linear infinite' }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}>
          {[...row1, ...row1].map((t, i) => <TestimonialCard key={`r1-${i}`} t={t} />)}
        </div>
      </motion.div>

      {/* Row 2 — slides right */}
      <motion.div
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="flex w-max" style={{ animation: 'slide-right 90s linear infinite' }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}>
          {[...row2, ...row2].map((t, i) => <TestimonialCard key={`r2-${i}`} t={t} />)}
        </div>
      </motion.div>

      <style>{`
        @keyframes slide-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slide-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

export default Testimonials;
