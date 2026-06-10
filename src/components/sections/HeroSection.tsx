import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { Button } from '../ui/Button';
import { ImageWithFallback } from '../ui/ImageWithFallback';

export interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
}

const SEEDS = [
  { id: 1,  src: '/images/ingredients/flax-seeds.png',       label: 'Flax Seeds',      size: 44, top: 8,  left: 5,  angle: 210, dist: 650, spin:  720, layer: 0, delay: 0.0  },
  { id: 2,  src: '/images/ingredients/pepper.png',           label: 'Black Pepper',    size: 32, top: 70, left: 88, angle: 40,  dist: 620, spin: -540, layer: 0, delay: 0.05 },
  { id: 3,  src: '/images/ingredients/kalonji-seed.png',     label: 'Kalonji',         size: 34, top: 83, left: 20, angle: 230, dist: 600, spin:  630, layer: 0, delay: 0.1  },
  { id: 4,  src: '/images/ingredients/fenugreek-seeds.png',  label: 'Fenugreek',       size: 36, top: 38, left: 95, angle: 10,  dist: 580, spin: -480, layer: 0, delay: 0.15 },
  { id: 5,  src: '/images/ingredients/cumin.png',            label: 'Cumin',           size: 54, top: 16, left: 80, angle: 330, dist: 560, spin:  540, layer: 1, delay: 0.08 },
  { id: 6,  src: '/images/ingredients/dates-seed.png',       label: 'Dates',           size: 58, top: 60, left: 6,  angle: 190, dist: 540, spin: -630, layer: 1, delay: 0.12 },
  { id: 7,  src: '/images/ingredients/watermenlon-seed.png', label: 'Watermelon Seed', size: 50, top: 28, left: 2,  angle: 170, dist: 580, spin:  480, layer: 1, delay: 0.04 },
  { id: 8,  src: '/images/ingredients/cardomom.png',         label: 'Cardamom',        size: 56, top: 76, left: 68, angle: 50,  dist: 520, spin: -540, layer: 1, delay: 0.18 },
  { id: 9,  src: '/images/ingredients/ginger.png',           label: 'Ginger',          size: 82, top: 10, left: 66, angle: 350, dist: 500, spin:  720, layer: 2, delay: 0.02 },
  { id: 10, src: '/images/ingredients/cinnamon.png',         label: 'Cinnamon',        size: 74, top: 52, left: 90, angle: 20,  dist: 480, spin: -540, layer: 2, delay: 0.14 },
  { id: 11, src: '/images/ingredients/mint-leaves.png',      label: 'Mint',            size: 78, top: 68, left: 40, angle: 150, dist: 460, spin:  630, layer: 2, delay: 0.06 },
  { id: 12, src: '/images/ingredients/Sunflower-seeds.png',  label: 'Nutrition Seeds', size: 80, top: 22, left: 12, angle: 200, dist: 480, spin: -720, layer: 2, delay: 0.1  },
];

const LAYER_OPACITY = [0.55, 0.78, 0.95];
const LAYER_GLOW    = ['rgba(124,255,178,0.15)', 'rgba(124,255,178,0.28)', 'rgba(124,255,178,0.45)'];
// parallax strength per layer — applied via motion values, never triggers re-render
const LAYER_PX = [0.010, 0.018, 0.026];

/**
 * Each seed gets its own motion values for parallax so mouse moves
 * never cause a React re-render and never interrupt the blast transition.
 */
function SeedParticle({
  seed,
  mouseX,
  mouseY,
  ready,
}: {
  seed: (typeof SEEDS)[0];
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  ready: boolean;
}) {
  const rad     = (seed.angle * Math.PI) / 180;
  const originX = Math.cos(rad) * seed.dist;
  const originY = Math.sin(rad) * seed.dist;

  const strength = LAYER_PX[seed.layer];
  const px = useSpring(useTransform(mouseX, (v) => v * strength), { stiffness: 60, damping: 28 });
  const py = useSpring(useTransform(mouseY, (v) => v * strength), { stiffness: 60, damping: 28 });

  const opacity = LAYER_OPACITY[seed.layer];
  const glow    = LAYER_GLOW[seed.layer];

  const floatDuration = 4 + seed.id * 0.35;
  const floatAmp      = 8 + seed.layer * 5;
  const floatId = `sf${seed.id}`;
  const keyframesStyle = `
    @keyframes ${floatId} {
      0%,100% { transform: translate3d(0, 0, 0) rotate(0deg); }
      25%      { transform: translate3d(0, -${floatAmp}px, 0) rotate(${seed.spin > 0 ? 4 : -4}deg); }
      75%      { transform: translate3d(0, ${Math.round(floatAmp * 0.5)}px, 0) rotate(${seed.spin > 0 ? -2 : 2}deg); }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style>
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{
          width:  seed.size,
          height: seed.size,
          top:    `${seed.top}%`,
          left:   `${seed.left}%`,
          zIndex: 10 + seed.layer,
          x: px,
          y: py,
          willChange: 'transform',
        }}
        // Hold at origin until images are ready, then blast in
        initial={{ translateX: originX, translateY: originY, scale: 0, opacity: 0, rotate: seed.spin }}
        animate={ready
          ? { translateX: 0, translateY: 0, scale: 1, opacity, rotate: 0 }
          : { translateX: originX, translateY: originY, scale: 0, opacity: 0, rotate: seed.spin }
        }
        transition={{
          translateX: { delay: seed.delay, duration: 1.3, ease: [0.16, 1, 0.3, 1] },
          translateY: { delay: seed.delay, duration: 1.3, ease: [0.16, 1, 0.3, 1] },
          scale:      { delay: seed.delay, duration: 1.1, ease: [0.34, 1.56, 0.64, 1] },
          opacity:    { delay: seed.delay, duration: 0.5, ease: 'easeOut' },
          rotate:     { delay: seed.delay, duration: 1.3, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        <ImageWithFallback
          src={seed.src}
          alt={seed.label}
          lazy={false}
          className="w-full h-full object-contain"
          style={{
            filter: `drop-shadow(0 6px 18px rgba(0,0,0,0.65)) drop-shadow(0 0 10px ${glow})`,
            animation: ready ? `${floatId} ${floatDuration}s ease-in-out ${seed.delay + 1.5}s infinite` : 'none',
            willChange: 'transform',
          }}
        />
      </motion.div>
    </>
  );
}

export function HeroSection({
  headline: _headline = 'Pure Nutrition from Nature',
  subheadline = 'ARF – Amruth Ruchi Foods brings you premium, natural superfoods crafted for the health-conscious. Pure ingredients, zero compromise.',
  ctaText = 'Explore Products',
  ctaLink = '#products',
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  // Gate: don't start blast until all seed images are loaded
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = SEEDS.length;
    const imgs = SEEDS.map((seed) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === total) setReady(true);
      };
      img.src = seed.src;
      return img;
    });
    // Fallback: fire after 2s even if some images fail
    const fallback = setTimeout(() => setReady(true), 2000);
    return () => {
      clearTimeout(fallback);
      imgs.forEach((img) => { img.onload = null; img.onerror = null; });
    };
  }, []);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '40%']);

  // Single shared mouse motion values — never cause re-renders
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawMouseX.set(e.clientX - window.innerWidth  / 2);
      rawMouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawMouseX, rawMouseY]);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (ctaLink.startsWith('#')) {
      e.preventDefault();
      document.querySelector(ctaLink)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-8"
      aria-label="Hero section"
    >
      {/* Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }} aria-hidden="true">
        <div className="absolute inset-0 bg-[#0F172A]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#0a1f0a]/80 to-[#2E7D32]/25" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(124,255,178,0.07) 0%, transparent 70%)' }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2E7D32]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FF9800]/8 rounded-full blur-3xl" />
      </motion.div>

      {/* Center burst flash */}
      <motion.div
        className="absolute z-30 pointer-events-none"
        style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
        initial={{ scale: 0.1, opacity: 0 }}
        animate={ready ? { scale: 9, opacity: [0, 0.85, 0] } : { scale: 0.1, opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      >
        <div className="w-32 h-32 rounded-full bg-[#7CFFB2]/30 blur-2xl" />
      </motion.div>

      {/* Seeds */}
      {SEEDS.map((seed) => (
        <SeedParticle key={seed.id} seed={seed} mouseX={rawMouseX} mouseY={rawMouseY} ready={ready} />
      ))}

      {/* Hero content */}
      <div className="relative z-20 container mx-auto px-4 text-center max-w-4xl flex-1 flex flex-col items-center justify-center">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-glow/30 bg-accent-glow/5 mb-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-glow animate-pulse" />
          <span className="text-accent-glow text-xs font-body tracking-widest uppercase">100% Natural · No Preservatives</span>
        </motion.div>

        <motion.h1
          className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-neutral-cream leading-tight mb-3"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
        >
          Pure{' '}
          <motion.span
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] via-[#7CFFB2] to-[#8BC34A]"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Nutrition
          </motion.span>
          {' '}from Nature
        </motion.h1>

        {/* Slogan */}
        <motion.p
          className="font-heading text-base sm:text-lg text-accent-glow/80 tracking-widest uppercase mb-3"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.68, ease: 'easeOut' }}
        >
          — Your Health, Our Concern —
        </motion.p>

        {/* Tagline */}
        <motion.p
          className="font-body text-sm sm:text-base text-neutral-cream/70 tracking-widest italic mb-4"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.76, ease: 'easeOut' }}
          style={{ textShadow: '0 0 18px rgba(124,255,178,0.25)' }}
        >
          Nutrition Meets Culinary Perfection
        </motion.p>

        <motion.p
          className="font-body text-base sm:text-lg text-neutral-cream/70 max-w-2xl mx-auto mb-7 leading-relaxed"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.82, ease: 'easeOut' }}
        >
          {subheadline}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
        >
          <a href={ctaLink} onClick={handleCtaClick} aria-label={ctaText} className="inline-block">
            <Button size="lg" variant="primary">{ctaText}</Button>
          </a>
          <a
            href="#about"
            onClick={(e) => { e.preventDefault(); document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="font-body text-neutral-cream/60 hover:text-accent-glow text-sm underline underline-offset-4 transition-colors duration-200"
          >
            Our Story →
          </a>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {SEEDS.filter((s) => s.layer === 2).map((s) => (
            <span key={s.id} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-cream/40 text-xs font-body">
              {s.label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator — in flow, not absolute */}
      <motion.div
        className="relative z-20 flex flex-col items-center gap-1 pb-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="text-neutral-cream/30 text-xs font-body tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-accent-glow/60 to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}

export default HeroSection;
