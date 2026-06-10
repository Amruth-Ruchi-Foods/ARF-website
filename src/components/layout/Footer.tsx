import { useState } from 'react';
import { motion } from 'framer-motion';
import { saveSubscriber } from '../../utils/leads';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const quickLinks: FooterLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const productLinks: FooterLink[] = [
  { label: 'Buttermilk Mix', href: '#products' },
  { label: 'Khajur Mix', href: '#products' },
  { label: 'Ghee Roasted Seeds', href: '#products' },
  { label: 'Superfoods', href: '#products' },
  { label: 'Energy Mixes', href: '#products' },
];

// SVG icons for social media
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const socialLinks: SocialLink[] = [
  { name: 'Instagram', href: 'https://www.instagram.com/arffoods', icon: <InstagramIcon /> },
  { name: 'Facebook', href: 'https://www.facebook.com/arffoods', icon: <FacebookIcon /> },
  { name: 'Twitter', href: 'https://twitter.com/arffoods', icon: <TwitterIcon /> },
  { name: 'YouTube', href: 'https://www.youtube.com/arffoods', icon: <YoutubeIcon /> },
];

interface FooterProps {
  showNewsletter?: boolean;
}

/**
 * Footer component with logo, quick links, social media icons, and newsletter signup
 * Validates: Requirements 1.10, 5.6, 5.7
 */
export default function Footer({ showNewsletter = true }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { setSubscribeStatus('error'); return; }
    const err = saveSubscriber(email);
    setSubscribeStatus(err ? 'error' : 'success');
    if (!err) setEmail('');
  };

  return (
    <footer className="bg-neutral-dark-bg border-t border-primary-green/20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="inline-flex items-center gap-3 mb-4 group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label="ARF - Amruth Ruchi Foods, go to home"
            >
              <div className="relative flex items-center justify-center rounded-xl bg-white/10 border border-white/15 px-2 py-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D32]/30 to-transparent pointer-events-none" />
                <ImageWithFallback
                  src="/images/logo/ARF logo.png"
                  alt=""
                  lazy={false}
                  className="h-12 w-auto object-contain relative z-10"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-lg text-neutral-cream tracking-wide">ARF</span>
                <span className="font-body text-[10px] text-accent-glow/70 tracking-widest uppercase">Amruth Ruchi Foods</span>
              </div>
            </motion.a>
            <p className="text-neutral-cream/60 text-sm font-body leading-relaxed mb-6">
              Amruth Ruchi Foods — Pure Nutrition from Nature. Bringing you the finest natural and healthy food products crafted with care.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.name}`}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-green/20 text-neutral-cream/70 hover:bg-primary-green hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-neutral-cream font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-neutral-cream/60 hover:text-primary-light-green text-sm transition-colors duration-200 font-body"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-neutral-cream font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Our Products
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-neutral-cream/60 hover:text-primary-light-green text-sm transition-colors duration-200 font-body"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          {showNewsletter && (
            <div>
              <h3 className="text-neutral-cream font-heading font-semibold text-sm uppercase tracking-wider mb-4">
                Stay Updated
              </h3>
              <p className="text-neutral-cream/60 text-sm font-body mb-4">
                Subscribe to our newsletter for health tips, new products, and exclusive offers.
              </p>
              <form onSubmit={handleNewsletterSubmit} noValidate aria-label="Newsletter signup">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSubscribeStatus('idle');
                    }}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 rounded-lg bg-primary-green/10 border border-primary-green/30 text-neutral-cream placeholder-neutral-cream/40 text-sm focus:outline-none focus:border-primary-light-green focus:ring-1 focus:ring-primary-light-green transition-colors"
                    aria-required="true"
                    aria-describedby={subscribeStatus !== 'idle' ? 'newsletter-status' : undefined}
                  />
                  <motion.button
                    type="submit"
                    className="w-full px-4 py-2.5 rounded-lg bg-primary-green hover:bg-primary-light-green text-white font-heading font-semibold text-sm transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
                {subscribeStatus === 'success' && (
                  <p id="newsletter-status" className="mt-2 text-accent-glow text-xs" role="status">
                    Thanks for subscribing!
                  </p>
                )}
                {subscribeStatus === 'error' && (
                  <p id="newsletter-status" className="mt-2 text-primary-orange text-xs" role="alert">
                    Please enter a valid email address.
                  </p>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-primary-green/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-cream/40 text-xs font-body text-center sm:text-left">
            © {new Date().getFullYear()} ARF — Amruth Ruchi Foods. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-xs text-neutral-cream/40 font-body">
            <a href="#" className="hover:text-primary-light-green transition-colors duration-200">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-primary-light-green transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
