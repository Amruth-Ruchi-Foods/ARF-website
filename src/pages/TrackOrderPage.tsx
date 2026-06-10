import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ordersApi } from '../services/api';
import { useUserAuth } from '../context/UserAuthContext';
import type { Order, OrderStatus } from '../types/order';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed:  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  shipped:    'bg-orange-500/20 text-orange-400 border-orange-500/30',
  delivered:  'bg-accent-glow/20 text-accent-glow border-accent-glow/30',
  cancelled:  'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function TrackOrderPage() {
  const { user, logout, isLoggedIn } = useUserAuth();
  const [phoneInput, setPhoneInput] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [error, setError] = useState('');

  // Auto-load if already logged in
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      ordersApi.getUserOrders(user.email)
        .then((found) => {
          setOrders(found);
          setSelected(found[0] ?? null);
        })
        .catch(console.error);
    }
  }, [isLoggedIn, user]);

  const handleLogin = async () => {
    if (!/^\d{10}$/.test(phoneInput)) { setError('Enter a valid 10-digit phone number'); return; }
    try {
      // Search by phone in delivery details - need to get all orders and filter
      const allOrders = await ordersApi.getAllOrders();
      const found = allOrders.filter((o: Order) => o.delivery.phone === phoneInput);
      if (found.length === 0) { setError('No orders found for this number'); return; }
      setOrders(found);
      setSelected(found[0]);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    }
  };

  const handleLogout = () => { logout(); setOrders([]); setSelected(null); setPhoneInput(''); };

  return (
    <div className="min-h-screen bg-[#0F172A] pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-neutral-cream mb-1">My Orders</h1>
          {isLoggedIn
            ? <div className="flex items-center gap-3 mt-2">
                <span className="font-body text-sm text-neutral-cream/50">Logged in as <span className="text-accent-glow">{user?.phone || user?.email}</span></span>
                <button onClick={handleLogout} className="font-body text-xs text-neutral-cream/30 hover:text-red-400 underline transition-colors">Logout</button>
              </div>
            : <p className="font-body text-neutral-cream/50 text-sm">Enter your phone number to view your orders</p>
          }
        </motion.div>

        {/* Login form */}
        {!isLoggedIn && (
          <motion.div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex-1">
              <input
                type="tel" maxLength={10} value={phoneInput}
                onChange={(e) => { setPhoneInput(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter your 10-digit phone number"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream placeholder-neutral-cream/30 font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors"
              />
              {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
            <button onClick={handleLogin} className="px-6 py-2.5 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors flex-shrink-0">
              View Orders
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {isLoggedIn && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {orders.length === 0 ? (
                <div className="text-center py-16 text-neutral-cream/40 font-body">
                  <p className="text-4xl mb-3">📦</p>
                  <p>No orders found for this number.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Order list */}
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <button key={order.id} onClick={() => setSelected(order)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === order.id ? 'border-accent-glow/50 bg-accent-glow/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                        <p className="font-heading font-semibold text-sm text-neutral-cream">{order.id}</p>
                        <p className="font-body text-xs text-neutral-cream/40 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                          <span className="font-heading font-bold text-sm text-accent-glow">₹{order.totalPrice}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Order detail */}
                  {selected && (
                    <motion.div key={selected.id} className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5"
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                      {/* Progress tracker */}
                      <div>
                        <h3 className="font-heading font-semibold text-sm text-neutral-cream mb-4">Order Progress</h3>
                        {selected.status === 'cancelled' ? (
                          <p className="text-red-400 font-body text-sm">This order has been cancelled.</p>
                        ) : (
                          <div className="flex items-center justify-between relative">
                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10 z-0" />
                            <div className="absolute top-4 left-0 h-0.5 bg-accent-glow z-0 transition-all duration-700"
                              style={{ width: `${(STATUS_STEPS.indexOf(selected.status) / (STATUS_STEPS.length - 1)) * 100}%` }} />
                            {STATUS_STEPS.map((step, i) => {
                              const done = i <= STATUS_STEPS.indexOf(selected.status);
                              return (
                                <div key={step} className="flex flex-col items-center z-10 flex-1">
                                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${done ? 'bg-accent-glow border-accent-glow text-[#0F172A]' : 'bg-[#0F172A] border-white/20 text-neutral-cream/30'}`}>
                                    {done ? '✓' : i + 1}
                                  </div>
                                  <span className={`mt-2 text-[10px] font-body capitalize text-center ${done ? 'text-accent-glow' : 'text-neutral-cream/30'}`}>{step}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div>
                        <h3 className="font-heading font-semibold text-sm text-neutral-cream/60 uppercase tracking-wider mb-3">Items</h3>
                        <div className="space-y-2">
                          {selected.items.map((item) => (
                            <div key={item.productId} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                              {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg bg-white/5 flex-shrink-0" />}
                              <div className="flex-1">
                                <p className="font-body text-sm text-neutral-cream">{item.name}</p>
                                <p className="font-body text-xs text-neutral-cream/50">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-heading font-bold text-sm text-accent-glow">₹{item.price * item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery */}
                      <div className="pt-3 border-t border-white/10">
                        <h3 className="font-heading font-semibold text-sm text-neutral-cream/60 uppercase tracking-wider mb-2">Delivery Address</h3>
                        <p className="font-body text-sm text-neutral-cream/70">{selected.delivery.address}, {selected.delivery.city}, {selected.delivery.state} – {selected.delivery.pincode}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
