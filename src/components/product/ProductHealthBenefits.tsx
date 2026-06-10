import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HealthBenefit } from '../../types/product';

interface ProductHealthBenefitsProps {
  benefits: HealthBenefit[];
}

/**
 * ProductHealthBenefits
 * Displays product-specific health benefits with icons.
 * Clicking a benefit expands it to show a detailed explanation.
 * Requirements: 2.5, 11.5
 */
export function ProductHealthBenefits({ benefits }: ProductHealthBenefitsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (benefits.length === 0) return null;

  const toggle = (index: number) =>
    setExpandedIndex(expandedIndex === index ? null : index);

  return (
    <motion.section
      aria-label="Health benefits"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-10"
    >
      <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-cream mb-6">
        Health Benefits
      </h2>

      <ul className="flex flex-col gap-3" aria-label="Product health benefits list">
        {benefits.map((benefit, index) => {
          const isOpen = expandedIndex === index;

          return (
            <motion.li
              key={benefit.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.08 }}
              className="rounded-2xl border bg-white/5 backdrop-blur-md overflow-hidden transition-colors duration-300"
              style={{
                borderColor: isOpen
                  ? 'rgba(124,255,178,0.5)'
                  : 'rgba(255,255,255,0.1)',
              }}
            >
              {/* Benefit header — clickable */}
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={`benefit-detail-${index}`}
                className="w-full flex items-center gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7CFFB2]"
              >
                {/* Icon */}
                <span
                  className="text-3xl flex-shrink-0 select-none"
                  role="img"
                  aria-label={benefit.title}
                >
                  {benefit.icon}
                </span>

                {/* Title */}
                <span className="flex-1 font-heading font-semibold text-neutral-cream text-base">
                  {benefit.title}
                </span>

                {/* Chevron */}
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-accent-glow/70 flex-shrink-0"
                  aria-hidden="true"
                >
                  ▾
                </motion.span>
              </button>

              {/* Expanded detail */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`benefit-detail-${index}`}
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 font-body text-sm text-neutral-cream/70 leading-relaxed border-t border-white/10 pt-3">
                      {benefit.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </motion.section>
  );
}

export default ProductHealthBenefits;
