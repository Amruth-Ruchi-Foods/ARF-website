import { motion } from 'framer-motion';
import type { NutritionInfo } from '../../types/product';

interface NutritionTableProps {
  nutrition: NutritionInfo;
}

/**
 * NutritionTable
 * Displays nutrition information in a standardized table format.
 * Includes serving size, servings per container, calories, and per-nutrient rows.
 * Requirements: 2.7, 10.4
 */
export function NutritionTable({ nutrition }: NutritionTableProps) {
  return (
    <motion.section
      aria-label="Nutrition information"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-10"
    >
      <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-cream mb-2">
        Nutrition Facts
      </h2>
      {nutrition.labCertified && (
        <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-accent-glow/10 border border-accent-glow/30">
          <span className="text-accent-glow text-sm">✅</span>
          <span className="font-body text-xs text-accent-glow font-semibold">Lab Certified</span>
          {nutrition.labReport && (
            <span className="font-body text-[10px] text-neutral-cream/40 hidden sm:inline">· {nutrition.labReport}</span>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden max-w-md">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/20 bg-white/5">
          <p className="font-body text-xs text-accent-glow/70 uppercase tracking-widest mb-1">Per serving · {nutrition.servingSize}</p>
          <div className="flex justify-between items-baseline mt-1">
            <span className="font-body text-sm text-neutral-cream/70">
              Serving size
            </span>
            <span className="font-body text-sm font-semibold text-neutral-cream">
              {nutrition.servingSize}
            </span>
          </div>
          <div className="flex justify-between items-baseline mt-0.5">
            <span className="font-body text-sm text-neutral-cream/70">
              Servings per container
            </span>
            <span className="font-body text-sm font-semibold text-neutral-cream">
              {nutrition.servingsPerContainer}
            </span>
          </div>
        </div>

        {/* Calories row */}
        <div className="px-5 py-3 border-b-4 border-white/20 flex justify-between items-center">
          <span className="font-heading font-bold text-neutral-cream text-base">
            Calories
          </span>
          <span className="font-heading font-bold text-accent-glow text-2xl">
            {nutrition.calories}
          </span>
        </div>

        {/* Daily value header */}
        <div className="px-5 py-2 border-b border-white/10 flex justify-end">
          <span className="font-body text-xs text-neutral-cream/50">
            % Daily Value*
          </span>
        </div>

        {/* Nutrient rows */}
        <table className="w-full" aria-label="Nutrient breakdown">
          <tbody>
            {nutrition.nutrients.map((nutrient, index) => (
              <tr
                key={nutrient.name}
                className={[
                  'border-b border-white/10 last:border-0',
                  index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]',
                ].join(' ')}
              >
                <td className="px-5 py-2.5 font-body text-sm text-neutral-cream/80">
                  {nutrient.name}
                  <span className="font-semibold text-neutral-cream ml-1">
                    {nutrient.amount}
                  </span>
                </td>
                <td className="px-5 py-2.5 text-right font-body text-sm font-semibold text-neutral-cream/70">
                  {nutrient.dailyValue ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer note */}
        <div className="px-5 py-3 border-t border-white/10 bg-white/[0.02]">
          <p className="font-body text-xs text-neutral-cream/40 leading-relaxed">
            * Percent Daily Values are based on a 2,000 calorie diet. Your daily
            values may be higher or lower depending on your calorie needs.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

export default NutritionTable;
