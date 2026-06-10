import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ordersApi } from '../services/api';
import type { Order } from '../types/order';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderConfirmedPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      ordersApi.getOrder(orderId)
        .then(setOrder)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  const stepIndex = order ? STATUS_STEPS.indexOf(order.status) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <p className="text-neutral-cream/50">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 pt-20 pb-16">
      <motion.div
        className="max-w-lg w-full"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success banner */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 180 }}
        >
          <div className="w-20 h-20 rounded-full bg-accent-glow/20 border-2 border-accent-glow flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-accent-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-heading font-bold text-3xl text-neutral-cream mb-2">Order Confirmed!</h1>
          <p className="font-body text-neutral-cream/60">
            Thank you{order ? `, ${order.delivery.name}` : ''}! Your order has been received and is being processed.
          </p>
          {order && (
            <p className="mt-2 font-body text-sm text-neutral-cream/40">
              A confirmation has been sent to <span className="text-accent-glow">{order.delivery.email}</span>
            </p>
          )}
        </motion.div>

        {order && (
          <>
            {/* Order summary card */}
            <motion.div
              className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5 space-y-3"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center">
                <span className="font-body text-xs text-neutral-cream/40 uppercase tracking-wider">Order ID</span>
                <span className="font-heading font-semibold text-sm text-accent-glow">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body text-xs text-neutral-cream/40 uppercase tracking-wider">Payment</span>
                <span className="font-body text-sm text-neutral-cream">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body text-xs text-neutral-cream/40 uppercase tracking-wider">Total</span>
                <span className="font-heading font-bold text-sm text-accent-glow">₹{order.totalPrice}</span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <span className="font-body text-xs text-neutral-cream/40 uppercase tracking-wider block mb-1">Delivering to</span>
                <p className="font-body text-sm text-neutral-cream/80">{order.delivery.address}, {order.delivery.city}, {order.delivery.state} – {order.delivery.pincode}</p>
              </div>
            </motion.div>

            {/* Order tracker */}
            <motion.div
              className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            >
              <h2 className="font-heading font-semibold text-sm text-neutral-cream mb-5">Order Status</h2>
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10 z-0" />
                <div
                  className="absolute top-4 left-0 h-0.5 bg-accent-glow z-0 transition-all duration-700"
                  style={{ width: stepIndex === 0 ? '0%' : `${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                />
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= stepIndex && order.status !== 'cancelled';
                  return (
                    <div key={step} className="flex flex-col items-center z-10 flex-1">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${done ? 'bg-accent-glow border-accent-glow text-[#0F172A]' : 'bg-[#0F172A] border-white/20 text-neutral-cream/30'}`}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span className={`mt-2 text-[10px] font-body capitalize text-center leading-tight ${done ? 'text-accent-glow' : 'text-neutral-cream/30'}`}>{step}</span>
                    </div>
                  );
                })}
              </div>
              {order.status === 'cancelled' && (
                <p className="text-center text-red-400 font-body text-sm mt-4">This order has been cancelled.</p>
              )}
            </motion.div>
          </>
        )}

        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        >
          <Link to="/track-order" className="flex-1 py-3 rounded-xl border border-accent-glow/40 text-accent-glow font-heading font-bold text-sm text-center hover:bg-accent-glow/10 transition-colors">
            Track My Orders
          </Link>
          <Link to="/" className="flex-1 py-3 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm text-center transition-colors">
            Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
