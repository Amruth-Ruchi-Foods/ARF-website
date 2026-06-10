import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';
import { ordersApi } from '../services/api';
import { initiatePayment } from '../services/razorpay';
import type { DeliveryDetails, PaymentMethod } from '../types/order';

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { id: 'cod',        label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
  { id: 'upi',        label: 'UPI',              icon: '📱', desc: 'GPay, PhonePe, Paytm, etc.' },
  { id: 'card',       label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking',      icon: '🏦', desc: 'All major banks supported' },
];

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry'];

const empty: DeliveryDetails = { name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '' };

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<DeliveryDetails>(empty);
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [errors, setErrors] = useState<Partial<DeliveryDetails>>({});
  const [placing, setPlacing] = useState(false);

  const set = (k: keyof DeliveryDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setDelivery((d) => ({ ...d, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const validate = () => {
    const e: Partial<DeliveryDetails> = {};
    if (!delivery.name.trim())    e.name    = 'Required';
    if (!/^\d{10}$/.test(delivery.phone)) e.phone = 'Enter valid 10-digit number';
    if (!/\S+@\S+\.\S+/.test(delivery.email)) e.email = 'Enter valid email';
    if (!delivery.address.trim()) e.address = 'Required';
    if (!delivery.city.trim())    e.city    = 'Required';
    if (!delivery.state)          e.state   = 'Required';
    if (!/^\d{6}$/.test(delivery.pincode)) e.pincode = 'Enter valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setPlacing(true);
    
    try {
      // For online payment methods (UPI, Card, Netbanking), use Razorpay
      if (payment === 'upi' || payment === 'card' || payment === 'netbanking') {
        // Create order first
        const orderData = {
          items,
          delivery,
          paymentMethod: payment,
          totalPrice: grandTotal,
          userEmail: user?.email,
        };
        const order = await ordersApi.createOrder(orderData);
        
        // Initiate Razorpay payment
        await initiatePayment({
          amount: grandTotal,
          customerName: delivery.name,
          customerEmail: delivery.email,
          customerPhone: delivery.phone,
          orderId: order.id,
          notes: {
            orderId: order.id,
            paymentMethod: payment,
          },
          onSuccess: (razorpayResponse) => {
            console.log('Payment successful:', razorpayResponse);
            clearCart();
            navigate(`/order-confirmed/${order.id}`);
          },
          onFailure: (error) => {
            console.error('Payment failed:', error);
            alert(`Payment failed: ${error}`);
            setPlacing(false);
          },
          onDismiss: () => {
            console.log('Payment dismissed');
            setPlacing(false);
          },
        });
      } else {
        // For COD, proceed directly
        const orderData = {
          items,
          delivery,
          paymentMethod: payment,
          totalPrice: grandTotal,
          userEmail: user?.email,
        };
        const order = await ordersApi.createOrder(orderData);
        clearCart();
        navigate(`/order-confirmed/${order.id}`);
        setPlacing(false);
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
      setPlacing(false);
    }
  };

  const gst = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + gst;

  if (items.length === 0) {
    navigate('/');
    return null;
  }

  const inputCls = (err?: string) =>
    `w-full px-4 py-2.5 rounded-xl bg-white/5 border ${err ? 'border-red-400/60' : 'border-white/10'} text-neutral-cream placeholder-neutral-cream/30 font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors`;

  return (
    <div className="min-h-screen bg-[#0F172A] pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.h1
          className="font-heading font-bold text-3xl text-neutral-cream mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Details */}
            <motion.div className="bg-white/5 border border-white/10 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-heading font-semibold text-lg text-neutral-cream mb-5">Delivery Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-cream/50 font-body mb-1">Full Name *</label>
                  <input className={inputCls(errors.name)} placeholder="Your full name" value={delivery.name} onChange={set('name')} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs text-neutral-cream/50 font-body mb-1">Phone *</label>
                  <input className={inputCls(errors.phone)} placeholder="10-digit mobile number" value={delivery.phone} onChange={set('phone')} maxLength={10} />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-neutral-cream/50 font-body mb-1">Email *</label>
                  <input className={inputCls(errors.email)} placeholder="your@email.com" value={delivery.email} onChange={set('email')} type="email" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-neutral-cream/50 font-body mb-1">Address *</label>
                  <textarea className={inputCls(errors.address) + ' resize-none'} rows={2} placeholder="House/Flat no., Street, Area" value={delivery.address} onChange={set('address')} />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-xs text-neutral-cream/50 font-body mb-1">City *</label>
                  <input className={inputCls(errors.city)} placeholder="City" value={delivery.city} onChange={set('city')} />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-xs text-neutral-cream/50 font-body mb-1">Pincode *</label>
                  <input className={inputCls(errors.pincode)} placeholder="6-digit pincode" value={delivery.pincode} onChange={set('pincode')} maxLength={6} />
                  {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-neutral-cream/50 font-body mb-1">State *</label>
                  <select className={inputCls(errors.state)} value={delivery.state} onChange={set('state')}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div className="bg-white/5 border border-white/10 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-heading font-semibold text-lg text-neutral-cream mb-5">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPayment(opt.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${payment === opt.id ? 'border-accent-glow/60 bg-accent-glow/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-heading font-semibold text-sm text-neutral-cream">{opt.label}</p>
                      <p className="font-body text-xs text-neutral-cream/50">{opt.desc}</p>
                    </div>
                    {payment === opt.id && <span className="ml-auto w-4 h-4 rounded-full bg-accent-glow flex-shrink-0" />}
                  </button>
                ))}
              </div>
              {payment === 'upi' && (
                <div className="mt-4 p-4 rounded-xl bg-accent-glow/5 border border-accent-glow/20">
                  <p className="font-body text-sm text-neutral-cream/70">UPI ID: <span className="text-accent-glow font-semibold">arffoods@upi</span></p>
                  <p className="font-body text-xs text-neutral-cream/40 mt-1">Pay and enter transaction ID after placing order</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Order Summary */}
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sticky top-24">
              <h2 className="font-heading font-semibold text-lg text-neutral-cream mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-lg bg-white/5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-neutral-cream truncate">{item.name}</p>
                      <p className="font-body text-xs text-neutral-cream/50">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-heading font-semibold text-sm text-accent-glow flex-shrink-0">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-3 space-y-2">
                <div className="flex justify-between font-body text-sm text-neutral-cream/60">
                  <span>Subtotal</span><span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-neutral-cream/60">
                  <span>GST (18%)</span><span>₹{gst}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-neutral-cream/60">
                  <span>Delivery</span><span className="text-accent-glow">Free</span>
                </div>
                <div className="flex justify-between font-heading font-bold text-base text-neutral-cream pt-1 border-t border-white/10">
                  <span>Total</span><span className="text-accent-glow">₹{grandTotal}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="mt-5 w-full py-3.5 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {placing ? 'Placing Order…' : 'Place Order'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
