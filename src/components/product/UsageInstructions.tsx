import { motion } from 'framer-motion';
import type { UsageInstruction } from '../../types/product';

interface UsageInstructionsProps {
  instructions: UsageInstruction[];
}

/**
 * UsageInstructions
 * Displays product usage instructions as a numbered list with staggered animations.
 * Requirements: 2.6, 10.5
 */
export function UsageInstructions({ instructions }: UsageInstructionsProps) {
  if (instructions.length === 0) return null;

  return (
    <motion.section
      aria-label="Usage instructions"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-10"
    >
      <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-cream mb-6">
        How to Use
      </h2>

      <ol
        className="flex flex-col gap-4"
        aria-label="Step-by-step usage instructions"
      >
        {instructions.map((item, index) => (
          <motion.li
            key={item.step}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.08 }}
            className="flex items-start gap-4"
          >
            {/* Step number badge */}
            <span
              className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-glow/15 border border-accent-glow/40 flex items-center justify-center font-heading font-bold text-accent-glow text-sm"
              aria-hidden="true"
            >
              {item.step}
            </span>

            {/* Instruction text */}
            <div className="flex-1 pt-1">
              <p className="font-body text-neutral-cream/80 leading-relaxed">
                {item.instruction}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </motion.section>
  );
}

export default UsageInstructions;
