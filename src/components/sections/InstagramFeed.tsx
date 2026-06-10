import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { InstagramPost } from '../../data/instagram';
import { getInstagramPosts } from '../../utils/adminData';
import { ImageWithFallback } from '../ui/ImageWithFallback';

function IgCard({ post, index }: { post: InstagramPost; index: number }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <a
      key={`${post.id}-${index}`}
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View Instagram post: ${post.caption}`}
      className="group relative flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7CFFB2]"
      style={{ width: '280px', height: '280px' }}
    >
      {/* Shimmer skeleton */}
      <div className={`absolute inset-0 bg-white/5 overflow-hidden transition-opacity duration-300 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div
          className="absolute inset-0 -translate-x-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)',
            animation: 'ig-shimmer 1.4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Image fades in once loaded */}
      <ImageWithFallback
        src={post.image}
        alt={post.caption}
        lazy={true}
        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
        onError={() => setLoaded(true)}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#0F172A]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-accent-glow" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
        <p className="text-neutral-cream text-sm text-center leading-snug line-clamp-2">{post.caption}</p>
        {post.likes !== undefined && (
          <span className="text-accent-glow text-xs font-semibold">♥ {post.likes}</span>
        )}
      </div>
    </a>
  );
}

export function InstagramFeed() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const posts = getInstagramPosts();
  const loopPosts = posts.length > 0 ? [...posts, ...posts, ...posts] : [];

  return (
    <section
      ref={sectionRef}
      id="community"
      className="relative bg-[#0F172A] py-20 overflow-hidden"
      aria-label="Instagram community feed"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(124,255,178,0.06)_0%,transparent_60%)] pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-block text-accent-glow font-body text-sm font-semibold tracking-widest uppercase mb-3">Community</span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-cream">Follow Us on Instagram</h2>
          <p className="font-body text-neutral-cream/60 mt-3 text-base">@arffoods — Join our community of health enthusiasts</p>
        </motion.div>
      </div>

      <style>{`
        @keyframes ig-scroll {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(calc(-280px * ${posts.length} - 16px * ${posts.length}), 0, 0); }
        }
        @keyframes ig-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .ig-track {
          display: flex;
          animation: ig-scroll ${posts.length * 5}s linear infinite;
          will-change: transform;
        }
        .ig-track:hover { animation-play-state: paused; }
      `}</style>

      <div className="overflow-hidden" aria-label="Instagram posts">
        <div className="ig-track" style={{ gap: '16px', paddingLeft: '16px' }}>
          {loopPosts.map((post, index) => (
            <IgCard key={`${post.id}-${index}`} post={post} index={index} />
          ))}
        </div>
      </div>

      <div className="text-center mt-10 px-4">
        <a
          href="https://www.instagram.com/arffoods/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-accent-glow/40 text-accent-glow font-heading font-semibold text-sm hover:bg-accent-glow/10 transition-colors duration-200"
        >
          View Profile on Instagram
        </a>
      </div>
    </section>
  );
}

export default InstagramFeed;
