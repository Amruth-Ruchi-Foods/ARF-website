import { HeroSection } from '../components/sections/HeroSection';
import { BrandStory } from '../components/sections/BrandStory';
import { FeaturedProducts } from '../components/sections/FeaturedProducts';
import { ProductCategories } from '../components/sections/ProductCategories';
import { HealthBenefits } from '../components/sections/HealthBenefits';
import { Testimonials } from '../components/sections/Testimonials';
import { InstagramFeed } from '../components/sections/InstagramFeed';
import { ContactSection } from '../components/sections/ContactSection';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { SEOHead } from '../components/ui/SEOHead';
import { generateOrganizationStructuredData } from '../utils/seo';

function CertificationBar() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#0a1a0a] via-[#0d2010] to-[#0a1a0a] border-y border-[#2E7D32]/20 py-6 px-4">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 70% 100% at 50% 50%, rgba(124,255,178,0.04) 0%, transparent 70%)' }} />
      {/* Decorative left/right fade */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#0a1a0a] to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#0a1a0a] to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative container mx-auto max-w-4xl flex items-center justify-center gap-4 sm:gap-10 flex-wrap">

        {/* FSSAI — real logo */}
        <div className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#7CFFB2]/30 transition-colors duration-300">
            <ImageWithFallback
              src="/verified/fssai.png"
              alt="FSSAI logo"
              lazy={false}
              className="h-6 sm:h-8 w-auto object-contain rounded-sm"
            />
          </div>
          <div>
            <p className="font-heading font-bold text-[10px] sm:text-xs text-neutral-cream leading-tight">FSSAI Licensed</p>
            <p className="font-body text-[9px] sm:text-[10px] text-neutral-cream/50 leading-tight">Food Safety Authority</p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-10 bg-gradient-to-b from-transparent via-[#7CFFB2]/20 to-transparent" aria-hidden="true" />

        {/* Lab Tested */}
        <div className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#7CFFB2]/30 transition-colors duration-300">
            <svg width="28" height="26" viewBox="0 0 36 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="36" height="32" rx="3" fill="#1a3a2a"/>
              <path d="M13 5 L13 15 L7 25 Q6.5 27 8.5 27 L27.5 27 Q29.5 27 29 25 L23 15 L23 5 Z" fill="none" stroke="#7CFFB2" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 22 L27 22 L23 15 L13 15 Z" fill="#7CFFB2" opacity="0.2"/>
              <circle cx="14" cy="21" r="1" fill="#7CFFB2" opacity="0.8"/>
              <circle cx="19" cy="19" r="0.8" fill="#7CFFB2" opacity="0.6"/>
              <rect x="11" y="4" width="14" height="1.5" rx="0.75" fill="#7CFFB2" opacity="0.5"/>
            </svg>
          </div>
          <div>
            <p className="font-heading font-bold text-[10px] sm:text-xs text-neutral-cream leading-tight">Lab Tested</p>
            <p className="font-body text-[9px] sm:text-[10px] text-neutral-cream/50 leading-tight">SLN Testing Lab</p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-10 bg-gradient-to-b from-transparent via-[#7CFFB2]/20 to-transparent" aria-hidden="true" />

        {/* Organic & Healthy */}
        <div className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#7CFFB2]/30 transition-colors duration-300">
            <svg width="26" height="26" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="40" height="40" rx="5" fill="#1a2e1a"/>
              <path d="M20 34 C20 34 8 26 10 15 C12 6 20 7 20 7 C20 7 28 6 30 15 C32 26 20 34 20 34Z" fill="#8BC34A" opacity="0.35" stroke="#8BC34A" strokeWidth="1.5"/>
              <path d="M20 34 L20 14" stroke="#8BC34A" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M20 27 C16 23 12 23 10 21" stroke="#8BC34A" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
              <path d="M20 21 C24 17 28 17 30 15" stroke="#8BC34A" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
              <circle cx="10" cy="10" r="1.2" fill="#7CFFB2" opacity="0.6"/>
              <circle cx="30" cy="8" r="0.9" fill="#7CFFB2" opacity="0.5"/>
              <circle cx="33" cy="14" r="0.7" fill="#7CFFB2" opacity="0.4"/>
            </svg>
          </div>
          <div>
            <p className="font-heading font-bold text-[10px] sm:text-xs text-neutral-cream leading-tight">100% Organic</p>
            <p className="font-body text-[9px] sm:text-[10px] text-neutral-cream/50 leading-tight">No Preservatives</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main id="main-content" className="w-full">
      <SEOHead
        title="Pure Nutrition from Nature"
        description="ARF - Amruth Ruchi Foods offers 100% organic superfoods, energy mixes, herbal drinks, and healthy snacks. FSSAI certified natural products for a healthier lifestyle."
        canonical={window.location.origin}
        type="website"
        keywords={['organic food', 'superfoods', 'healthy snacks', 'herbal drinks', 'natural products', 'FSSAI certified', 'nutrition', 'wellness']}
        structuredData={generateOrganizationStructuredData()}
      />
      
      {/* 1. Hero */}
      <HeroSection />

      {/* Trust bar */}
      <CertificationBar />

      {/* 2. Brand Story */}
      <BrandStory />

      {/* 3. Featured Products (staggered card animations) */}
      <FeaturedProducts />

      {/* 4. Product Categories */}
      <ProductCategories />

      {/* 5. Health Benefits */}
      <HealthBenefits />

      {/* 6. Testimonials */}
      <Testimonials />

      {/* 7. Instagram / Community */}
      <InstagramFeed />

      {/* 8. Contact */}
      <ContactSection />
    </main>
  );
}
