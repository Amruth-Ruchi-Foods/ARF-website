import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { getProductBySlug } from '../data/products';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { IngredientsShowcase } from '../components/product/IngredientsShowcase';
import { NutritionTable } from '../components/product/NutritionTable';
import { UsageInstructions } from '../components/product/UsageInstructions';
import { ProductHealthBenefits } from '../components/product/ProductHealthBenefits';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { SEOHead } from '../components/ui/SEOHead';
import { generateProductStructuredData } from '../utils/seo';
import type { ProductVariant } from '../types/product';

function VegMark({ size = 24 }: { size?: number }) {
  return (
    <span title="Vegetarian" aria-label="Vegetarian" style={{ width: size, height: size, display: 'inline-flex', flexShrink: 0 }}>
      <svg viewBox="0 0 24 24" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="22" height="22" rx="3" ry="3" fill="white" stroke="#00a550" strokeWidth="2.2" />
        <circle cx="12" cy="12" r="6" fill="#00a550" />
      </svg>
    </span>
  );
}

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? getProductBySlug(productId) : undefined;
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const defaultVariant = product?.variants?.[0] ?? null;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(defaultVariant);
  // 'single' = show single product image, 'pack' = show pack view
  const [thumbView, setThumbView] = useState<'single' | 'pack'>('single');

  const activePrice = selectedVariant?.price ?? product?.price ?? 0;
  const packVariants = product?.variants?.filter((v) => v.packCount && v.packCount > 1) ?? [];
  const packVariant = packVariants.length > 0 ? packVariants[0] : null;
  // Reset to single view if no pack variants
  const safeThumbView = packVariant ? thumbView : 'single';
  const displayPackCount = safeThumbView === 'pack'
    ? ((selectedVariant?.packCount ?? 1) > 1 ? selectedVariant!.packCount! : packVariant?.packCount ?? 25)
    : 1;

  const handleAddToCart = () => {
    if (!product) return;
    const label = selectedVariant ? ` (${selectedVariant.label})` : '';
    addToCart({ productId: product.id + (selectedVariant ? `-${selectedVariant.weight}` : ''), name: product.name + label, price: activePrice, image: product.images.thumbnail });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const label = selectedVariant ? ` (${selectedVariant.label})` : '';
    addToCart({ productId: product.id + (selectedVariant ? `-${selectedVariant.weight}` : ''), name: product.name + label, price: activePrice, image: product.images.thumbnail });
    navigate('/checkout');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-heading font-bold text-4xl text-neutral-cream mb-4">Product Not Found</h1>
          <p className="font-body text-neutral-cream/60 mb-8">We couldn't find the product you're looking for.</p>
          <Link to="/"><Button variant="primary">Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  const allImages = [product.images.main, ...product.images.gallery].filter(Boolean);

  // Generate structured data for product
  const productStructuredData = generateProductStructuredData({
    name: product.name,
    description: product.description,
    image: `${window.location.origin}${product.images.main}`,
    brand: 'ARF - Amruth Ruchi Foods',
    offers: {
      price: activePrice,
      priceCurrency: 'INR',
      availability: product.inStock ? 'InStock' : 'OutOfStock',
    },
  });

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <SEOHead
        title={product.name}
        description={`${product.description} - ${product.benefits.map(b => b.title).join(', ')}`}
        canonical={`${window.location.origin}/products/${product.slug}`}
        image={`${window.location.origin}${product.images.main}`}
        type="product"
        keywords={[product.name, product.category, ...(product.tags || []), 'organic', 'healthy']}
        structuredData={productStructuredData}
      />
      
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_60%_20%,rgba(46,125,50,0.1)_0%,transparent_60%)] pointer-events-none" aria-hidden="true" />

      <div className="relative container mx-auto max-w-6xl px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 font-body text-sm text-neutral-cream/50">
            <li><Link to="/" className="hover:text-accent-glow transition-colors duration-200">Home</Link></li>
            <li aria-hidden="true" className="text-neutral-cream/30">/</li>
            <li><Link to="/#products" className="hover:text-accent-glow transition-colors duration-200">Products</Link></li>
            <li aria-hidden="true" className="text-neutral-cream/30">/</li>
            <li className="text-neutral-cream/80" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Main image — shows pack of packets when packCount > 1 */}
            <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center" style={{ height: '360px', background: 'linear-gradient(135deg, #1a2e1a 0%, #0f1f2e 50%, #1a1a0f 100%)' }}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_55%,rgba(255,255,255,0.07)_0%,transparent_70%)]" />
              <div className="absolute top-3 right-3 z-20"><VegMark size={26} /></div>

              {safeThumbView === 'pack' && displayPackCount > 1 ? (
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2">
                  <div className="relative w-full overflow-hidden" style={{ height: '260px' }}>
                    {Array.from({ length: displayPackCount }).map((_, i) => {
                      const total = displayPackCount;
                      // Spread packets across full width, overlapping
                      const containerWidth = 340; // approx px
                      const packetWidth = 60;
                      const totalSpread = containerWidth - packetWidth;
                      const step = totalSpread / (total - 1);
                      const left = i * step;
                      const brightness = 0.5 + (i / (total - 1)) * 0.5;
                      return (
                        <motion.img
                          key={i}
                          src={allImages[0]}
                          alt={`Packet ${i + 1}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.02, duration: 0.2, ease: 'easeOut' }}
                          className="absolute object-contain"
                          style={{
                            height: '220px',
                            width: `${packetWidth}px`,
                            left: `calc(50% - ${containerWidth / 2}px + ${left}px)`,
                            top: '20px',
                            zIndex: i + 1,
                            filter: `brightness(${brightness})`,
                          }}
                        />
                      );
                    })}
                  </div>
                  <p className="text-accent-glow/70 text-xs font-body mt-1">Pack of {displayPackCount}</p>
                </div>
              ) : (
                /* Single product image — scaled by weight */
                <motion.img
                  key={selectedVariant?.weight ?? 'default'}
                  src={allImages[activeImage]}
                  alt={product.name}
                  className="relative z-10 w-auto max-w-[85%] object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
                  style={{ height: `${Math.round(200 * (selectedVariant?.imageScale ?? 1))}px`, maxHeight: '420px' }}                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-4">
              {/* Single product thumb */}
              <button
                onClick={() => setThumbView('single')}
                className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors duration-200 ${safeThumbView === 'single' ? 'border-accent-glow' : 'border-white/10 hover:border-white/30'}`}
                aria-label="View single product"
              >
                <ImageWithFallback src={allImages[0]} alt={product.name} lazy={true} className="w-full h-full object-contain bg-white/5" />
              </button>

              {/* Pack view thumb — only if product has pack variants AND selected variant is a pack */}
              {packVariant && (selectedVariant?.packCount ?? 1) > 1 && (
                <button
                  onClick={() => setThumbView('pack')}
                  className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors duration-200 relative ${safeThumbView === 'pack' ? 'border-accent-glow' : 'border-white/10 hover:border-white/30'}`}
                  aria-label={`View pack of ${packVariant.packCount}`}
                >
                  <div className="w-full h-full bg-white/5 flex items-center justify-center relative overflow-hidden">
                    {[0,1,2,3,4].map((j) => (
                      <ImageWithFallback key={j} src={allImages[0]} alt="" lazy={true} className="absolute object-contain"
                        style={{ height: '52px', width: '18px', left: `${8 + j * 10}px`, top: '14px', filter: `brightness(${0.5 + j * 0.12})` }} />
                    ))}
                  </div>
                  <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] font-body text-accent-glow/80">
                    Pack of {(selectedVariant?.packCount ?? 1) > 1 ? selectedVariant!.packCount : packVariant.packCount}
                  </span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Right: Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <span className="inline-block w-fit px-3 py-1 rounded-full bg-accent-glow/10 border border-accent-glow/30 text-accent-glow text-xs font-semibold font-body uppercase tracking-wider">
              {product.category.replace(/-/g, ' ')}
            </span>

            <div>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-neutral-cream leading-tight">
                  {product.name}
                </h1>
                {product.subtitle && (
                  <p className="font-body text-sm text-accent-glow/70 italic mt-1">{product.subtitle}</p>
                )}
              </div>

            <p className="font-body text-neutral-cream/70 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-accent-glow/10 border border-accent-glow/25 text-accent-glow text-xs font-body">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-3xl text-accent-glow">₹{activePrice}</span>
              <span className="font-body text-neutral-cream/40 text-sm">{product.currency}</span>
              {selectedVariant && (
                <span className="font-body text-neutral-cream/40 text-sm">· {selectedVariant.label}</span>
              )}
            </div>

            {/* Variant selector */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <p className="font-body text-xs text-neutral-cream/40 uppercase tracking-wider mb-2">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.weight}
                      onClick={() => { setSelectedVariant(v); setThumbView((v.packCount ?? 1) > 1 ? 'pack' : 'single'); }}
                      disabled={!v.inStock}
                      className={`px-3 py-1.5 rounded-xl border text-sm font-body transition-all duration-200 ${
                        selectedVariant?.weight === v.weight
                          ? 'border-accent-glow bg-accent-glow/10 text-accent-glow'
                          : v.inStock
                          ? 'border-white/10 text-neutral-cream/60 hover:border-white/30 hover:text-neutral-cream'
                          : 'border-white/5 text-neutral-cream/20 cursor-not-allowed line-through'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-accent-glow' : 'bg-red-400'}`} aria-hidden="true" />
              <span className="font-body text-sm text-neutral-cream/60">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="primary" size="lg" onClick={handleAddToCart} disabled={!product.inStock} aria-label={`Add ${product.name} to cart`} className="flex-1">
                {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
              </Button>
              <Button variant="outline" size="lg" onClick={handleBuyNow} aria-label={`Buy ${product.name} now`} className="flex-1">
                Buy Now
              </Button>
            </div>

            {product.benefits.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <p className="font-body text-xs text-neutral-cream/40 uppercase tracking-wider mb-3">Key Benefits</p>
                <ul className="flex flex-wrap gap-2">
                  {product.benefits.map((b) => (
                    <li key={b.title} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-cream/70 text-sm font-body">
                      <span aria-hidden="true">{b.icon}</span>
                      {b.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>

        {/* Detail sections */}
        <div className="mt-16 border-t border-white/10 pt-10 grid grid-cols-1 lg:grid-cols-2 gap-x-16">
          <div>
            <IngredientsShowcase ingredients={product.ingredients} />
            <UsageInstructions instructions={product.usage} />
          </div>
          <div>
            <ProductHealthBenefits benefits={product.benefits} />
            <NutritionTable nutrition={product.nutrition} />
          </div>
        </div>
      </div>
    </div>
  );
}
