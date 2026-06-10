import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { FloatingSeeds } from '../ui/FloatingSeeds';
import { CartDrawer } from '../ui/CartDrawer';
import { AuthModal } from '../ui/AuthModal';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout component that wraps all pages with consistent structure
 * Provides the main container with Navbar and Footer
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-dark-bg relative">
      {/* Ambient floating seeds — visible on all pages */}
      <FloatingSeeds />
      <CartDrawer />
      <AuthModal />

      <Navbar />
      
      <main className="w-full relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
