import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionValueEvent } from 'framer-motion';

const SEEDS = [
  { id: 1,  src: '/images/ingredients/flax-seeds.png',       size: 38, top: 12, left: 4,   layer: 0, delay: 0.0 },
  { id: 2,  src: '/images/ingredients/pepper.png',           size: 28, top: 72, left: 90,  layer: 0, delay: 0.4 },
  { id: 3,  src: '/images/ingredients/kalonji-seed.png',     size: 30, top: 85, left: 18,  layer: 0, delay: 0.8 },
  { id: 4,  src: '/images/ingredients/fenugreek-seeds.png',  size: 32, top: 40, left: 96,  layer: 0, delay: 1.2 },
  { id: 5,  src: '/images/ingredients/cumin.png',            size: 48, top: 18, left: 82,  layer: 1, delay: 0.2 },
  { id: 6,  src: '/images/ingredients/dates-seed.png',       size: 52, top: 62, left: 5,   layer: 1, delay: 0.6 },
  { id: 7,  src: '/images/ingredients/watermenlon-seed.png', size: 44, top: 30, left: 1,   layer: 1, delay: 1.0 },
  { id: 8,  src: '/images/ingredients/cardomom.png',         size: 50, top: 78, left: 70,  layer: 1, delay: 1.4 },
  { id: 9,  src: '/images/ingredients/ginger.png',           size: 70, top: 8,  left: 68,  layer: 2, delay: 0.1 },
  { id: 10, src: '/images/ingredients/cinnamon.png',         size: 64, top: 55, left: 92,  layer: 2, delay: 0.5 },
  { id: 11, src: '/images/ingredients/mint-leaves.png',      size: 68, top: 70, left: 42,  layer: 2, delay: 0.9 },
  { id: 12, src: '/images/ingredients/Sunflower-seeds.png',  size: 72, top: 24, left: 10,  layer: 2, delay: 1.3 },
];

const LAYER_OPACITY = [0.18, 0.28, 0.38];
const LAYER_GLOW = [
  'rgba(124,255,178,0.10)',
  'rgba(124,255,178,0.18)',
  'rgba(124,255,178,0.28)',
];

export function FloatingSeeds() {
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0 });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sx = useSpring(rawX, { stiffness: 60, damping: 30 });
  const sy = useSpring(rawY, { stiffness: 60, damping: 30 });
  useMotionValueEvent(sx, 'change', (v) => setSmoothMouse((m) => ({ ...m, x: v })));
  useMotionValueEvent(sy, 'change', (v) => setSmoothMouse((m) => ({ ...m, y: v })));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX - window.innerWidth / 2);
      rawY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawX, rawY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {SEEDS.map((seed) => {
        const opacity = LAYER_OPACITY[seed.layer];
        const glow = LAYER_GLOW[seed.layer];
        const parallaxX = smoothMouse.x * (0.005 + seed.layer * 0.008);
        const parallaxY = smoothMouse.y * (0.005 + seed.layer * 0.008);

        return (
          <motion.div
            key={seed.id}
            className="absolute"
            style={{
              width: seed.size,
              height: seed.size,
              top: `${seed.top}%`,
              left: `${seed.left}%`,
              zIndex: seed.layer,
              x: parallaxX,
              y: parallaxY,
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity, scale: 1 }}
            transition={{ delay: seed.delay, duration: 1.2, ease: 'easeOut' }}
          >
            <motion.img
              src={seed.src}
              alt=""
              className="w-full h-full object-contain"
              style={{
                filter: `drop-shadow(0 4px 12px rgba(0,0,0,0.5)) drop-shadow(0 0 8px ${glow})`,
              }}
              animate={{
                y: [0, -(6 + seed.layer * 4), 0, (5 + seed.layer * 2), 0],
                x: [0, (3 + seed.layer * 2), 0, -(2 + seed.layer * 1), 0],
                rotate: [0, seed.id % 2 === 0 ? 5 : -5, 0, seed.id % 2 === 0 ? -3 : 3, 0],
              }}
              transition={{
                delay: seed.delay + 1.2,
                duration: 5 + seed.id * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default FloatingSeeds;
