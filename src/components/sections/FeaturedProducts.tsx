import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ProductCard } from '../product/ProductCard';
import { getProducts } from '../../utils/adminData';

export function FeaturedProducts() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: '-60px' });
  const featuredProducts = getProducts().filter((p) => p.featured);

  return (
    <section id="products" className="relative bg-[#0F172A] py-24 px-4 overflow-hidden" aria-label="Featured products">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(46,125,50,0.14)_0%,transparent_60%)] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(124,255,178,0.06)_0%,transparent_60%)] pointer-events-none" aria-hidden="true" />
      {/* Decorative large text */}
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[200px] font-heading font-black text-white/[0.015] select-none pointer-events-none leading-none" aria-hidden="true">ARF</div>

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
            Our
            <span className="w-6 h-px bg-accent-glow/60" />
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-neutral-cream mb-4">
            Delicious <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] to-[#7CFFB2]">Products</span>
          </h2>
          <p className="font-body text-neutral-cream/60 max-w-xl mx-auto text-base leading-relaxed">
            Handpicked from nature, crafted with care. Each product is a promise of purity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.2 + index * 0.15 }}
              className="h-full"
            >
              <ProductCard
                id={product.id}
                name={product.name}
                subtitle={product.subtitle}
                description={product.description}
                price={product.price}
                variants={product.variants}
                image={product.images.thumbnail}
                slug={product.slug}
                category={product.category}
                benefits={product.benefits}
              />
            </motion.div>
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <a
            href="#categories"
            onClick={(e) => { e.preventDefault(); document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-accent-glow/30 text-accent-glow font-heading font-semibold text-sm hover:bg-accent-glow/10 transition-colors duration-200"
          >
            Browse All Categories →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
