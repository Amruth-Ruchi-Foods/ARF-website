import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ProductCategory, HealthBenefit, ProductVariant } from '../../types/product';
import { getProductFeedbacks } from '../../utils/leads';
import { staticTestimonials } from '../../data/testimonials';
import { ImageWithFallback } from '../ui/ImageWithFallback';

// Map product IDs to their testimonial product name strings
const PRODUCT_NAME_MAP: Record<string, string[]> = {
  'buttermilk-mix-001':      ['Buttermilk Mix', 'Flax Seed Buttermilk Powder'],
  'flax-mix-seeds-002':      ['Flax Mix Seeds'],
  'ghee-roasted-seeds-003':  ['Ghee Roasted Seeds'],
  'jumbo-kajur-004':         ['Jumbo Kajur'],
  'khajur-seed-powder-005':  ['Khajur Seed Powder'],
  'pailwan-khajur-006':      ['Pailwan Khajur', 'Khajur Mix'],
};

/** FSSAI-style green vegetarian dot mark */
function VegMark({ size = 20 }: { size?: number }) {
  return (
    <span
      title="Vegetarian"
      aria-label="Vegetarian"
      style={{ width: size, height: size, display: 'inline-flex', flexShrink: 0 }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="22" height="22" rx="3" ry="3" fill="white" stroke="#00a550" strokeWidth="2.2" />
        <circle cx="12" cy="12" r="6" fill="#00a550" />
      </svg>
    </span>
  );
}

export interface ProductCardProps {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  price: number;
  variants?: ProductVariant[];
  image: string;
  slug: string;
  category: ProductCategory;
  benefits: HealthBenefit[];
  onHover?: () => void;
  onClick?: () => void;
}

export function ProductCard({
  id,
  name,
  subtitle,
  description,
  price,
  variants,
  image,
  slug,
  category,
  onHover,
  onClick,
}: ProductCardProps) {
  const lowestPrice = variants?.length
    ? Math.min(...variants.map(v => v.price))
    : price;
  const formattedPrice = `₹${lowestPrice}`;

  // Calculate average rating from both localStorage feedback and static testimonials
  const feedbacks = getProductFeedbacks().filter((f) => f.productId === id);
  const productNames = PRODUCT_NAME_MAP[id] ?? [];
  const staticRatings = staticTestimonials
    .filter((t) => productNames.some((n) => t.product.toLowerCase().includes(n.toLowerCase())))
    .map((t) => t.rating);
  const allRatings = [...feedbacks.map((f) => f.rating), ...staticRatings];
  const avgRating = allRatings.length > 0
    ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
    : null;
  const reviewCount = allRatings.length;

  return (
    <Link
      to={`/products/${slug}`}
      className="block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7CFFB2]"
      onClick={onClick}
      aria-label={`View details for ${name}`}
    >
      <motion.div
        className="glassmorphism rounded-xl cursor-pointer overflow-hidden p-0 flex flex-col h-full"
        onMouseEnter={onHover}
        whileHover={{
          scale: 1.03,
          boxShadow: '0 0 24px rgba(124, 255, 178, 0.6)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Product image — fixed height */}
        <div
          className="relative overflow-hidden flex items-center justify-center flex-shrink-0"
          style={{
            height: '260px',
            background: 'linear-gradient(135deg, #1a2e1a 0%, #0f1f2e 50%, #1a1a0f 100%)',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_60%,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1a2a1a]/80 to-transparent" />
          <div className="absolute top-2.5 right-2.5 z-20">
            <VegMark size={22} />
          </div>
          <motion.div
            whileHover={{ scale: 1.08, y: -4 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ImageWithFallback
              src={image}
              alt={name}
              lazy={true}
              className="relative z-10 h-[240px] w-auto max-w-[90%] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        </div>

        {/* Product info — flex-1 so all cards stretch to same height */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category badge */}
          <span className="mb-2 inline-block rounded-full bg-primary-green/20 px-2 py-0.5 text-xs font-heading text-accent-glow capitalize w-fit">
            {category.replace('-', ' ')}
          </span>

          {/* Name */}
          <h3 className="font-heading text-lg font-semibold text-neutral-cream leading-snug line-clamp-2">
            {name}
          </h3>

          {/* Subtitle */}
          {subtitle && (
            <p className="font-body text-xs text-accent-glow/70 italic mt-0.5 line-clamp-1">
              {subtitle}
            </p>
          )}

          {/* Description */}
          <p className="mt-1 mb-3 font-body text-sm text-neutral-cream/70 line-clamp-2 flex-1">
            {description}
          </p>

          {/* Price + rating — always at bottom */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
            <p className="font-heading text-xl font-bold text-accent-glow" style={{ textShadow: '0 0 8px rgba(124,255,178,0.35)' }}>
              {formattedPrice}
            </p>
            {avgRating !== null && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-sm">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>
                <span className="font-body text-xs text-neutral-cream/40">({reviewCount})</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default ProductCard;
