import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Ingredient } from '../../types/product';

interface IngredientsShowcaseProps {
  ingredients: Ingredient[];
}

/**
 * IngredientsShowcase
 * Displays ingredients in a circular card layout with floating animations on mount.
 * Cards expand on hover to reveal detailed ingredient information.
 * Requirements: 2.4, 4.5, 11.4
 */
export function IngredientsShowcase({ ingredients }: IngredientsShowcaseProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section aria-label="Ingredients" className="py-10">
      <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-cream mb-2">
        What's Inside
      </h2>
      <p className="font-body text-neutral-cream/60 mb-8 text-sm">
        Hover over each ingredient to learn more
      </p>

      <div
        className="flex flex-wrap gap-4 justify-start"
        role="list"
        aria-label="Ingredient cards"
      >
        {ingredients.map((ingredient, index) => (
          <IngredientCard
            key={ingredient.name}
            ingredient={ingredient}
            index={index}
            isExpanded={expandedIndex === index}
            onToggle={() =>
              setExpandedIndex(expandedIndex === index ? null : index)
            }
          />
        ))}
      </div>
    </section>
  );
}

interface IngredientCardProps {
  ingredient: Ingredient;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function IngredientCard({
  ingredient,
  index,
  isExpanded,
  onToggle,
}: IngredientCardProps) {
  return (
    <motion.article
      role="listitem"
      aria-label={ingredient.name}
      aria-expanded={isExpanded}
      /* Floating animation on mount with staggered delay */
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: [0, -6, 0],
        transition: {
          opacity: { duration: 0.4, delay: index * 0.1 },
          y: {
            delay: index * 0.1 + 0.4,
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
      }}
      whileHover={{ scale: 1.05 }}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      tabIndex={0}
      className={[
        'relative cursor-pointer rounded-2xl border transition-colors duration-300',
        'bg-white/5 backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7CFFB2]',
        isExpanded
          ? 'border-accent-glow/60 shadow-[0_0_20px_rgba(124,255,178,0.25)]'
          : 'border-white/10 hover:border-primary-green/50',
      ].join(' ')}
      style={{ minWidth: '140px', maxWidth: '200px' }}
      layout
    >
      {/* Collapsed view — always visible */}
      <div className="flex flex-col items-center text-center p-5 gap-2">
        <span
          className="text-4xl select-none"
          role="img"
          aria-label={ingredient.name}
        >
          {ingredient.icon}
        </span>
        <h3 className="font-heading font-semibold text-neutral-cream text-sm leading-tight">
          {ingredient.name}
        </h3>
        {ingredient.percentage !== undefined && (
          <span className="text-xs font-body text-accent-glow/80">
            {ingredient.percentage}%
          </span>
        )}
      </div>

      {/* Expanded detail panel */}
      <motion.div
        initial={false}
        animate={isExpanded ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
        aria-hidden={!isExpanded}
      >
        <div className="px-4 pb-4 border-t border-white/10 pt-3">
          <p className="font-body text-xs text-neutral-cream/70 leading-relaxed mb-3">
            {ingredient.description}
          </p>
          {ingredient.benefits.length > 0 && (
            <ul className="flex flex-col gap-1" aria-label={`${ingredient.name} benefits`}>
              {ingredient.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-1.5 text-xs font-body text-neutral-cream/60"
                >
                  <span className="w-1 h-1 rounded-full bg-accent-glow flex-shrink-0" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}

export default IngredientsShowcase;
