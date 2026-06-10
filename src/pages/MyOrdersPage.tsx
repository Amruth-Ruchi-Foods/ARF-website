import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { ordersApi } from '../services/api';
import type { Order, OrderStatus } from '../types/order';
import { CartDrawer } from '../components/ui/CartDrawer';
import { AuthModal } from '../components/ui/AuthModal';
import { ProfileModal } from '../components/ui/ProfileModal';
import { saveProductFeedback, hasFeedback } from '../utils/leads';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed:  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  shipped:    'bg-orange-500/20 text-orange-400 border-orange-500/30',
  delivered:  'bg-accent-glow/20 text-accent-glow border-accent-glow/30',
  cancelled:  'bg-red-500/20 text-red-400 border-red-500/30',
};

function FeedbackModal({
  orderId,
  productId,
  productName,
  authorName,
  onClose,
}: {
  orderId: string;
  productId: string;
  productName: string;
  authorName: string;
  onClose: (submitted: boolean) => void;
}) {
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText]       = useState('');
  const [location, setLocation] = useState('');
  const [done, setDone]       = useState(false);
  const [tooLow, setTooLow]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    const saved = saveProductFeedback({ orderId, productId, productName, author: authorName, location, rating, text });
    if (!saved) { setTooLow(true); setDone(true); }
    else setDone(true);
  };

  return (
    <>
      <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => onClose(done)} />
      <motion.div className="fixed inset-0 z-[90] flex items-center justify-center px-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="w-full max-w-sm bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.93, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}>

          <div className="px-6 pt-6 pb-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <p className="font-heading font-bold text-neutral-cream text-sm">Rate your purchase</p>
              <p className="font-body text-xs text-neutral-cream/40 mt-0.5 truncate max-w-[220px]">{productName}</p>
            </div>
            <button onClick={() => onClose(done)} className="text-neutral-cream/30 hover:text-neutral-cream transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {done ? (
            <div className="px-6 py-10 text-center">
              {tooLow ? (
                <>
                  <div className="text-4xl mb-3">🙏</div>
                  <p className="font-heading font-bold text-neutral-cream mb-2">Thank you for your feedback</p>
                  <p className="font-body text-sm text-neutral-cream/50">We're sorry to hear it wasn't a great experience. We'll work on improving.</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-3">🌟</div>
                  <p className="font-heading font-bold text-accent-glow mb-2">Review published!</p>
                  <p className="font-body text-sm text-neutral-cream/50">Your review is now live on our website. Thank you!</p>
                </>
              )}
              <button onClick={() => onClose(true)} className="mt-6 px-6 py-2.5 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Star picker */}
              <div>
                <p className="font-body text-xs text-neutral-cream/50 mb-2">Your rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button"
                      onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(s)}
                      className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                      aria-label={`${s} star`}>
                      <span className={(hovered || rating) >= s ? 'text-[#FF9800]' : 'text-white/20'}>★</span>
                    </button>
                  ))}
                </div>
                {rating > 0 && rating < 4 && (
                  <p className="text-xs text-yellow-400/80 mt-1">Your feedback will be kept private and used to improve our products.</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-neutral-cream/50 mb-1">Your city</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Bengaluru" required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
              </div>

              <div>
                <label className="block text-xs text-neutral-cream/50 mb-1">Your review</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)} required rows={3} placeholder="Tell others about your experience…"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors resize-none" />
              </div>

              <button type="submit" disabled={rating === 0}
                className="w-full py-2.5 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors disabled:opacity-40">
                Submit Review
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

export default function MyOrdersPage() {
  const { user, isLoggedIn, openLogin } = useUserAuth();
  const navigate = useNavigate();
  const [orders, setOrders]     = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState<{ orderId: string; productId: string; productName: string } | null>(null);
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState<Set<string>>(new Set());
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoggedIn && user) {
      ordersApi.getUserOrders(user.email).then((found) => {
        setOrders(found);
        setSelected(found[0] ?? null);
      }).catch((err) => {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      });
    }
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <motion.div className="text-center max-w-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="font-heading font-bold text-2xl text-neutral-cream mb-2">Sign in to view orders</h1>
          <p className="font-body text-neutral-cream/50 text-sm mb-6">Login to your ARF account to see your order history.</p>
          <button onClick={openLogin} className="px-6 py-3 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors">
            Login / Sign Up
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <CartDrawer />
      <AuthModal />
      {/* Custom top bar — no nav links */}
      <div className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur border-b border-white/10 px-4 h-16 flex items-center justify-between">
        {/* Left: back + logo */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-neutral-cream/50 hover:text-neutral-cream transition-colors font-body text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="text-white/10">|</span>
          <img src="/images/logo/ARF logo.png" alt="ARF" className="h-9 w-auto object-contain rounded-md" />
        </div>

        {/* Right: profile avatar */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-accent-glow/20 border border-accent-glow/40 flex items-center justify-center text-accent-glow text-sm font-bold font-heading group-hover:border-accent-glow/70 transition-colors">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-body text-xs text-neutral-cream/80 leading-none">{user?.name}</p>
              <p className="font-body text-[10px] text-neutral-cream/40 mt-0.5">Edit profile</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-neutral-cream/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Profile modal */}
      <AnimatePresence>
        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      </AnimatePresence>

      {/* Feedback modal */}
      <AnimatePresence>
        {feedbackTarget && (
          <FeedbackModal
            orderId={feedbackTarget.orderId}
            productId={feedbackTarget.productId}
            productName={feedbackTarget.productName}
            authorName={user?.name ?? 'Customer'}
            onClose={(submitted) => {
              if (submitted) setSubmittedFeedbacks((prev) => new Set(prev).add(`${feedbackTarget.orderId}-${feedbackTarget.productId}`));
              setFeedbackTarget(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Page content */}
      <div className="px-4 py-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div className="mb-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading font-bold text-2xl text-neutral-cream">My Orders</h1>
            <p className="font-body text-neutral-cream/40 text-sm mt-1">
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </p>
          </motion.div>

          {orders.length === 0 ? (
            <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-5xl mb-4">📦</div>
              <p className="font-body text-neutral-cream/40 mb-4">You haven't placed any orders yet.</p>
              <button onClick={() => navigate('/')} className="px-6 py-3 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors">
                Start Shopping
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order list */}
              <div className="space-y-3">
                {orders.map((order, i) => (
                  <motion.button key={order.id} onClick={() => setSelected(order)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === order.id ? 'border-accent-glow/50 bg-accent-glow/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <p className="font-heading font-semibold text-sm text-neutral-cream">{order.id}</p>
                    <p className="font-body text-xs text-neutral-cream/40 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="font-body text-xs text-neutral-cream/50 mt-1">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                      <span className="font-heading font-bold text-sm text-accent-glow">₹{order.totalPrice}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Order detail */}
              <AnimatePresence mode="wait">
                {selected && (
                  <motion.div key={selected.id} className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 h-fit"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h2 className="font-heading font-bold text-lg text-neutral-cream">{selected.id}</h2>
                        <p className="font-body text-xs text-neutral-cream/40">{new Date(selected.createdAt).toLocaleString('en-IN')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                    </div>

                    {/* Progress tracker */}
                    {selected.status !== 'cancelled' && (
                      <div>
                        <h3 className="font-heading font-semibold text-sm text-neutral-cream/60 uppercase tracking-wider mb-4">Delivery Progress</h3>
                        <div className="flex items-center justify-between relative">
                          <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10 z-0" />
                          <div className="absolute top-4 left-0 h-0.5 bg-accent-glow z-0 transition-all duration-700"
                            style={{ width: `${(STATUS_STEPS.indexOf(selected.status) / (STATUS_STEPS.length - 1)) * 100}%` }} />
                          {STATUS_STEPS.map((step, i) => {
                            const done = i <= STATUS_STEPS.indexOf(selected.status);
                            return (
                              <div key={step} className="flex flex-col items-center z-10 flex-1">
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${done ? 'bg-accent-glow border-accent-glow text-[#0F172A]' : 'bg-[#0F172A] border-white/20 text-neutral-cream/30'}`}>
                                  {done ? '✓' : i + 1}
                                </div>
                                <span className={`mt-2 text-[10px] font-body capitalize text-center ${done ? 'text-accent-glow' : 'text-neutral-cream/30'}`}>{step}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div>
                      <h3 className="font-heading font-semibold text-sm text-neutral-cream/60 uppercase tracking-wider mb-3">Items Ordered</h3>
                      <div className="space-y-2">
                        {selected.items.map((item) => (
                          <div key={item.productId} className="flex flex-col gap-2 p-3 rounded-xl bg-white/5">
                            {/* Top row: image + name + price */}
                            <div className="flex items-center gap-3">
                              {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-lg bg-white/5 flex-shrink-0" />}
                              <div className="flex-1">
                                <p className="font-body text-sm text-neutral-cream">{item.name}</p>
                                <p className="font-body text-xs text-neutral-cream/50">Qty: {item.quantity} × ₹{item.price}</p>
                              </div>
                              <p className="font-heading font-bold text-sm text-accent-glow flex-shrink-0">₹{item.price * item.quantity}</p>
                            </div>
                            {/* Rate row — only for delivered */}
                            {selected.status === 'delivered' && (
                              <div className="pt-1 border-t border-white/5">
                                {!hasFeedback(selected.id, item.productId) && !submittedFeedbacks.has(`${selected.id}-${item.productId}`) ? (
                                  <button
                                    onClick={() => setFeedbackTarget({ orderId: selected.id, productId: item.productId, productName: item.name })}
                                    className="w-full py-1.5 rounded-lg bg-accent-glow/10 hover:bg-accent-glow/20 border border-accent-glow/25 hover:border-accent-glow/50 text-accent-glow font-body text-xs font-semibold transition-colors">
                                    ★ Rate this product
                                  </button>
                                ) : (
                                  <p className="text-center text-xs font-body text-neutral-cream/30">✓ Reviewed — thank you!</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-3 pt-3 border-t border-white/10">
                        <span className="font-body text-sm text-neutral-cream/60">Order Total</span>
                        <span className="font-heading font-bold text-accent-glow">₹{selected.totalPrice}</span>
                      </div>
                    </div>

                    {/* Delivery & Payment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                      <div>
                        <h3 className="font-heading font-semibold text-sm text-neutral-cream/60 uppercase tracking-wider mb-2">Delivery Address</h3>
                        <p className="font-body text-sm text-neutral-cream/70 leading-relaxed">
                          {selected.delivery.name}<br />
                          {selected.delivery.address}<br />
                          {selected.delivery.city}, {selected.delivery.state} – {selected.delivery.pincode}<br />
                          📞 {selected.delivery.phone}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-sm text-neutral-cream/60 uppercase tracking-wider mb-2">Payment</h3>
                        <p className="font-body text-sm text-neutral-cream/70 capitalize">
                          {selected.paymentMethod === 'cod' ? '💵 Cash on Delivery' :
                           selected.paymentMethod === 'upi' ? '📱 UPI' :
                           selected.paymentMethod === 'card' ? '💳 Card' : '🏦 Net Banking'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
