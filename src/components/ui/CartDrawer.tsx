import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#0F172A] border-l border-white/10 z-[70] flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h2 className="font-heading font-bold text-lg text-neutral-cream">
                Cart <span className="text-accent-glow">({totalItems})</span>
              </h2>
              <button onClick={closeCart} className="text-neutral-cream/50 hover:text-neutral-cream transition-colors p-1" aria-label="Close cart">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-cream/40">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="font-body text-sm">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded-lg bg-white/5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-neutral-cream truncate">{item.name}</p>
                      <p className="font-body text-accent-glow text-sm font-bold mt-0.5">₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-neutral-cream text-sm flex items-center justify-center transition-colors">−</button>
                        <span className="font-body text-sm text-neutral-cream w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-neutral-cream text-sm flex items-center justify-center transition-colors">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.productId)} className="text-neutral-cream/30 hover:text-red-400 transition-colors self-start mt-1" aria-label={`Remove ${item.name}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-body text-neutral-cream/60 text-sm">Total</span>
                  <span className="font-heading font-bold text-xl text-accent-glow">₹{totalPrice}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout →
                </button>
                <button onClick={clearCart} className="w-full py-2 text-neutral-cream/40 hover:text-neutral-cream/70 font-body text-xs transition-colors">
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
