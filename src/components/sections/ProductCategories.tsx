import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { ProductCategory } from '../../types/product';

interface Category {
  id: ProductCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
  border: string;
  glow: string;
  tags: string[];
}

const categories: Category[] = [
  {
    id: 'superfoods',
    name: 'Superfoods',
    icon: '🌿',
    description: 'Nutrient-dense natural foods packed with vitamins and minerals',
    color: 'from-green-500/15 to-transparent',
    border: 'hover:border-green-400/50',
    glow: 'rgba(34,197,94,0.3)',
    tags: ['Antioxidants', 'Vitamins', 'Minerals'],
  },
  {
    id: 'energy-mixes',
    name: 'Energy Mixes',
    icon: '⚡',
    description: 'Natural fuel for your day — dates, nuts, and seeds',
    color: 'from-yellow-500/15 to-transparent',
    border: 'hover:border-yellow-400/50',
    glow: 'rgba(234,179,8,0.3)',
    tags: ['Pre-workout', 'No Sugar Crash', 'Sustained'],
  },
  {
    id: 'herbal-drinks',
    name: 'Herbal Drinks',
    icon: '🍵',
    description: 'Traditional Ayurvedic blends for digestion and immunity',
    color: 'from-teal-500/15 to-transparent',
    border: 'hover:border-teal-400/50',
    glow: 'rgba(20,184,166,0.3)',
    tags: ['Ayurvedic', 'Probiotic', 'Digestive'],
  },
  {
    id: 'healthy-snacks',
    name: 'Healthy Snacks',
    icon: '🥜',
    description: 'Guilt-free wholesome bites roasted in pure desi ghee',
    color: 'from-orange-500/15 to-transparent',
    border: 'hover:border-orange-400/50',
    glow: 'rgba(249,115,22,0.3)',
    tags: ['High Protein', 'Ghee Roasted', 'Crunchy'],
  },
];

export function ProductCategories() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: '-60px' });

  return (
    <section id="categories" className="relative bg-[#0F172A] py-24 px-4 overflow-hidden" aria-label="Product categories">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(139,195,74,0.08)_0%,transparent_60%)] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,152,0,0.06)_0%,transparent_60%)] pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-6xl">
        <motion.div
          ref={headingRef}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 text-accent-glow font-body text-sm font-semibold tracking-widest uppercase mb-4">
            <span className="w-6 h-px bg-accent-glow/60" />
            Browse by Type
            <span className="w-6 h-px bg-accent-glow/60" />
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-neutral-cream mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] to-[#7CFFB2]">Categories</span>
          </h2>
          <p className="font-body text-neutral-cream/60 max-w-xl mx-auto text-base">
            From ancient Ayurvedic recipes to modern superfoods — something for every health goal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label={`Browse ${cat.name}`}
              className={`group relative flex flex-col items-center text-center p-7 rounded-2xl cursor-pointer
                bg-gradient-to-b ${cat.color} bg-white/[0.03]
                backdrop-blur-md border border-white/10 ${cat.border}
                focus:outline-none focus:ring-2 focus:ring-accent-glow/60
                transition-all duration-300`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 + i * 0.1 }}
              whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${cat.glow}` }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Icon */}
              <motion.span
                className="text-5xl mb-4 block select-none"
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 3.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                aria-hidden="true"
              >
                {cat.icon}
              </motion.span>

              <h3 className="font-heading font-semibold text-neutral-cream text-lg mb-2">{cat.name}</h3>
              <p className="font-body text-xs text-neutral-cream/55 leading-snug mb-4">{cat.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-1 mt-auto">
                {cat.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-cream/40 text-[10px] font-body">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom accent */}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-accent-glow rounded-full group-hover:w-3/4 transition-all duration-400" aria-hidden="true" />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductCategories;
