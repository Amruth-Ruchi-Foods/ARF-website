import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useUserAuth } from '../../context/UserAuthContext';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Navbar component with sticky positioning, smooth scrolling, and mobile menu
 * Features:
 * - Sticky positioning that stays at top during scroll
 * - Transparent background that becomes solid on scroll
 * - Smooth scroll to sections when clicking navigation links
 * - Mobile hamburger menu for responsive design
 * 
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
 */
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { totalItems, openCart } = useCart();
  const { isLoggedIn, user, openLogin, openProfile, logout } = useUserAuth();

  const handleLogoutClick = () => setConfirmLogout(true);
  const handleLogoutConfirm = () => { logout(); setConfirmLogout(false); };
  const handleLogoutCancel = () => setConfirmLogout(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMyOrdersPage = pathname === '/my-orders';

  // Detect scroll position to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section — navigates home first if not on landing page
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    } else {
      // Not on landing page — go home and scroll after navigation
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-dark-bg/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="ARF - Amruth Ruchi Foods, go to home"
          >
            <ImageWithFallback
              src="/images/logo/ARF logo.png"
              alt="ARF – Amruth Ruchi Foods"
              lazy={false}
              className="h-14 md:h-16 w-auto object-contain rounded-lg"
            />
          </motion.a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {!isMyOrdersPage && navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-neutral-cream/90 hover:text-primary-light-green transition-colors duration-200 font-medium"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </motion.a>
            ))}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => navigate('/my-orders')}
                  className="text-neutral-cream/80 hover:text-accent-glow transition-colors duration-200 font-medium text-sm"
                  whileHover={{ y: -2 }}
                >
                  My Orders
                </motion.button>
                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  <button
                    onClick={openProfile}
                    className="w-7 h-7 rounded-full bg-accent-glow/20 border border-accent-glow/40 flex items-center justify-center text-accent-glow text-xs font-bold hover:bg-accent-glow/30 transition-colors"
                    aria-label="Edit profile"
                    title="Edit profile"
                  >
                    {user?.name?.[0]?.toUpperCase()}
                  </button>
                  {confirmLogout ? (
                    <div className="flex items-center gap-1.5">
                      <span className="font-body text-xs text-neutral-cream/50">Logout?</span>
                      <button onClick={handleLogoutConfirm} className="font-body text-xs text-red-400 hover:text-red-300 transition-colors">Yes</button>
                      <button onClick={handleLogoutCancel} className="font-body text-xs text-neutral-cream/40 hover:text-neutral-cream transition-colors">No</button>
                    </div>
                  ) : (
                    <button onClick={handleLogoutClick} className="font-body text-xs text-neutral-cream/40 hover:text-red-400 transition-colors">Logout</button>
                  )}
                </div>
              </div>
            ) : (
              <motion.button
                onClick={openLogin}
                className="px-4 py-1.5 rounded-full border border-accent-glow/40 text-accent-glow font-body text-sm hover:bg-accent-glow/10 transition-colors"
                whileHover={{ scale: 1.03 }}
              >
                Login
              </motion.button>
            )}
          </div>

          {/* Cart + Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* Cart icon */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg text-neutral-cream hover:bg-white/10 transition-colors"
              aria-label={`Open cart, ${totalItems} items`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent-glow text-[#0F172A] text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-cream hover:bg-primary-green/20 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span className="w-full h-0.5 bg-current" animate={isMobileMenuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} />
                <motion.span className="w-full h-0.5 bg-current" animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.3 }} />
                <motion.span className="w-full h-0.5 bg-current" animate={isMobileMenuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-neutral-dark-bg/98 backdrop-blur-lg border-t border-primary-green/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              {!isMyOrdersPage && navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block py-3 px-4 text-neutral-cream/90 hover:text-primary-light-green hover:bg-primary-green/10 rounded-lg transition-colors duration-200 font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.label}
                </motion.a>
              ))}
              {isLoggedIn ? (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <button onClick={() => { openProfile(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-3 px-4 text-neutral-cream hover:bg-white/5 rounded-lg transition-colors font-medium">
                    Edit Profile
                  </button>
                  <button onClick={() => { navigate('/my-orders'); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-3 px-4 text-accent-glow hover:bg-accent-glow/10 rounded-lg transition-colors font-medium">
                    My Orders
                  </button>
                  <button onClick={() => { handleLogoutClick(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-3 px-4 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors font-medium">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/10">
                  <button onClick={() => { openLogin(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-3 px-4 text-accent-glow hover:bg-accent-glow/10 rounded-lg transition-colors font-medium">
                    Login / Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout confirmation overlay */}
      <AnimatePresence>
        {confirmLogout && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleLogoutCancel} />
            <motion.div className="fixed inset-0 z-[70] flex items-center justify-center px-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="w-full max-w-xs bg-[#0F172A] border border-white/10 rounded-2xl p-6 shadow-2xl text-center"
                initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                onClick={(e) => e.stopPropagation()}>
                <p className="font-heading font-bold text-neutral-cream mb-1">Logout?</p>
                <p className="font-body text-xs text-neutral-cream/40 mb-5">You'll need to sign in again to view your orders.</p>
                <div className="flex gap-3">
                  <button onClick={handleLogoutCancel}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-neutral-cream/60 hover:bg-white/5 font-body text-sm transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleLogoutConfirm}
                    className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 font-body text-sm font-semibold transition-colors">
                    Logout
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
