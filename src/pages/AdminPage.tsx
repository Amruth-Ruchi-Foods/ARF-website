import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ordersApi } from '../services/api';
import { getContactMessages, markMessageRead, deleteContactMessage, getSubscribers, deleteSubscriber, getProductFeedbacks } from '../utils/leads';
import type { Order, OrderStatus } from '../types/order';
import type { ContactMessage, NewsletterSubscriber, ProductFeedback } from '../utils/leads';
import type { Product } from '../types/product';
import type { InstagramPost } from '../data/instagram';
import {
  getProducts, addProduct, updateProduct, deleteProduct,
  getInstagramPosts, addInstagramPost, updateInstagramPost, deleteInstagramPost,
  deleteFeedback,
} from '../utils/adminData';

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const ADMIN_PASSWORD = 'arf2024';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed:  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  shipped:    'bg-orange-500/20 text-orange-400 border-orange-500/30',
  delivered:  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled:  'bg-red-500/20 text-red-400 border-red-500/30',
};

const STATUS_ICONS: Record<OrderStatus, string> = {
  pending: '🕐', confirmed: '✅', processing: '⚙️', shipped: '🚚', delivered: '📦', cancelled: '❌',
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: '💵 COD', upi: '📱 UPI', card: '💳 Card', netbanking: '🏦 Net Banking',
};

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className={`rounded-2xl border p-4 ${color}`}>
      <p className="font-body text-xs text-neutral-cream/50 uppercase tracking-wider">{label}</p>
      <p className="font-heading font-bold text-2xl text-neutral-cream mt-1">{value}</p>
      {sub && <p className="font-body text-xs text-neutral-cream/40 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');
  const [selected_ids, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>('confirmed');
  const [bulkDone, setBulkDone] = useState(false);
  const [view, setView] = useState<'split' | 'table'>('split');
  void setView; // used in view toggle buttons
  const [tab, setTab] = useState<'orders' | 'messages' | 'subscribers' | 'products' | 'feedback' | 'instagram'>('orders');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [subSearch, setSubSearch] = useState('');

  // Products state
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [showProductForm, setShowProductForm] = useState(false);

  // Feedback state
  const [feedbacks, setFeedbacks] = useState<ProductFeedback[]>([]);

  // Instagram state
  const [igPosts, setIgPosts] = useState<InstagramPost[]>([]);
  const [editingIg, setEditingIg] = useState<InstagramPost | null>(null);
  const [igForm, setIgForm] = useState<Partial<InstagramPost>>({});
  const [showIgForm, setShowIgForm] = useState(false);

  const refresh = async () => {
    try {
      const allOrders = await ordersApi.getAllOrders();
      setOrders(allOrders);
      setMessages(getContactMessages());
      setSubscribers(getSubscribers());
      setAdminProducts(getProducts());
      setFeedbacks(getProductFeedbacks());
      setIgPosts(getInstagramPosts());
    } catch (error) {
      console.error('Failed to refresh orders:', error);
    }
  };
  useEffect(() => { if (authed) refresh(); }, [authed]);

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(''); }
    else setPwError('Incorrect password');
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await ordersApi.updateOrderStatus(orderId, status);
      refresh();
      if (selected?.id === orderId) setSelected((o) => o ? { ...o, status } : o);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleBulkUpdate = async () => {
    try {
      await Promise.all(
        Array.from(selected_ids).map((id) => ordersApi.updateOrderStatus(id, bulkStatus))
      );
      refresh();
      setSelectedIds(new Set());
      setBulkDone(true);
      setTimeout(() => setBulkDone(false), 2000);
      if (selected && selected_ids.has(selected.id)) setSelected((o) => o ? { ...o, status: bulkStatus } : o);
    } catch (error) {
      console.error('Failed to bulk update orders:', error);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected_ids.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((o) => o.id)));
  };

  const stats = useMemo(() => ({
    total: orders.length,
    revenue: orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.totalPrice, 0),
    pending: orders.filter((o) => o.status === 'pending').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  }), [orders]);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        o.delivery.name.toLowerCase().includes(q) ||
        o.delivery.phone.includes(q) ||
        o.delivery.email?.toLowerCase().includes(q) ||
        o.delivery.city.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'amount_high') return b.totalPrice - a.totalPrice;
      return a.totalPrice - b.totalPrice;
    });
  }, [orders, filter, search, sortBy]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <motion.div className="w-full max-w-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="font-heading font-bold text-2xl text-neutral-cream">Admin Panel</h1>
            <p className="font-body text-neutral-cream/40 text-sm mt-1">ARF Order Management</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs text-neutral-cream/50 font-body mb-1">Password</label>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors"
                placeholder="Enter admin password" autoFocus />
              {pwError && <p className="text-red-400 text-xs mt-1">{pwError}</p>}
            </div>
            <button onClick={handleLogin} className="w-full py-3 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors">
              Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-neutral-cream">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur border-b border-white/10 px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="font-heading font-bold text-lg">ARF Admin</span>
            <span className="px-2 py-0.5 rounded-full bg-accent-glow/20 text-accent-glow text-xs font-body border border-accent-glow/30">{orders.length} orders</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Tab switcher */}
            <div className="flex rounded-xl overflow-hidden border border-white/10 flex-wrap">
              {([
                { id: 'orders',      label: '📦 Orders',      count: orders.length },
                { id: 'messages',    label: '✉️ Messages',    count: messages.filter(m => !m.read).length },
                { id: 'subscribers', label: '📬 Subscribers', count: subscribers.length },
                { id: 'products',    label: '🛒 Products',    count: adminProducts.length },
                { id: 'feedback',    label: '⭐ Feedback',    count: feedbacks.length },
                { id: 'instagram',   label: '📸 Instagram',   count: igPosts.length },
              ] as const).map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 text-xs font-body transition-colors flex items-center gap-1.5 ${tab === t.id ? 'bg-accent-glow/20 text-accent-glow' : 'text-neutral-cream/40 hover:text-neutral-cream/70'}`}>
                  {t.label}
                  {t.count > 0 && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === t.id ? 'bg-accent-glow/30' : 'bg-white/10'}`}>{t.count}</span>}
                </button>
              ))}
            </div>
            <button onClick={refresh} className="px-3 py-1.5 rounded-xl border border-white/10 text-neutral-cream/50 hover:text-neutral-cream text-xs font-body transition-colors">
              ↻ Refresh
            </button>            <button onClick={() => setAuthed(false)} className="px-3 py-1.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-body transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {tab === 'orders' && (<>
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Total Orders" value={stats.total} color="bg-white/5 border-white/10" />
          <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} color="bg-emerald-500/5 border-emerald-500/20" />
          <StatCard label="Pending" value={stats.pending} color="bg-yellow-500/5 border-yellow-500/20" />
          <StatCard label="Shipped" value={stats.shipped} color="bg-orange-500/5 border-orange-500/20" />
          <StatCard label="Delivered" value={stats.delivered} color="bg-emerald-500/5 border-emerald-500/20" />
          <StatCard label="Cancelled" value={stats.cancelled} color="bg-red-500/5 border-red-500/20" />
        </div>

        {/* Filters + Search + Sort */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-cream/30 text-sm">🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, order ID…"
              className="w-full pl-8 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-cream placeholder-neutral-cream/30 font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
          </div>
          {/* Status filter */}
          <div className="flex gap-1.5 flex-wrap">
            {(['all', ...STATUSES] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-body border transition-colors capitalize ${filter === s ? 'bg-accent-glow/20 text-accent-glow border-accent-glow/40' : 'text-neutral-cream/50 border-white/10 hover:border-white/20'}`}>
                {s !== 'all' && STATUS_ICONS[s]} {s}
              </button>
            ))}
          </div>
          {/* Sort */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-cream/70 font-body text-xs focus:outline-none focus:border-accent-glow/60 transition-colors">
            <option value="newest" className="bg-[#0F172A]">Newest first</option>
            <option value="oldest" className="bg-[#0F172A]">Oldest first</option>
            <option value="amount_high" className="bg-[#0F172A]">Amount ↓</option>
            <option value="amount_low" className="bg-[#0F172A]">Amount ↑</option>
          </select>
        </div>

        {/* Bulk action bar */}
        <AnimatePresence>
          {selected_ids.size > 0 && (
            <motion.div className="flex items-center gap-3 flex-wrap p-3 rounded-xl bg-accent-glow/5 border border-accent-glow/20"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <span className="font-body text-sm text-accent-glow">{selected_ids.size} selected</span>
              <span className="text-neutral-cream/20">|</span>
              <span className="font-body text-xs text-neutral-cream/50">Set status to:</span>
              <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value as OrderStatus)}
                className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-neutral-cream font-body text-xs focus:outline-none capitalize">
                {STATUSES.map((s) => <option key={s} value={s} className="bg-[#0F172A] capitalize">{STATUS_ICONS[s]} {s}</option>)}
              </select>
              <button onClick={handleBulkUpdate}
                className="px-4 py-1.5 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-xs transition-colors">
                {bulkDone ? '✓ Done' : 'Apply'}
              </button>
              <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-neutral-cream/30 hover:text-neutral-cream/60 text-xs font-body transition-colors">
                Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-cream/30 font-body">No orders found</div>
        ) : view === 'table' ? (
          /* ── TABLE VIEW ── */
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" checked={selected_ids.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="accent-[#4ade80] w-4 h-4 cursor-pointer" />
                  </th>
                  {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Date', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-neutral-cream/40 uppercase tracking-wider font-body">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <motion.tr key={order.id}
                    className={`border-b border-white/5 transition-colors cursor-pointer ${selected_ids.has(order.id) ? 'bg-accent-glow/5' : 'hover:bg-white/5'}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    onClick={() => setSelected(order)}
                  >
                    <td className="px-4 py-3" onClick={(e) => { e.stopPropagation(); toggleSelect(order.id); }}>
                      <input type="checkbox" checked={selected_ids.has(order.id)} onChange={() => toggleSelect(order.id)}
                        className="accent-[#4ade80] w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="px-4 py-3 font-heading font-semibold text-neutral-cream/80 text-xs whitespace-nowrap">{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-neutral-cream/80">{order.delivery.name}</p>
                      <p className="text-neutral-cream/40 text-xs">{order.delivery.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-neutral-cream/60 text-xs">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3 font-heading font-bold text-accent-glow whitespace-nowrap">₹{order.totalPrice}</td>
                    <td className="px-4 py-3 text-neutral-cream/50 text-xs">{PAYMENT_LABELS[order.paymentMethod]}</td>
                    <td className="px-4 py-3 text-neutral-cream/40 text-xs whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-neutral-cream font-body text-xs focus:outline-none capitalize">
                        {STATUSES.map((s) => <option key={s} value={s} className="bg-[#0F172A] capitalize">{s}</option>)}
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (

          /* ── SPLIT VIEW ── */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Order list */}
            <div className="lg:col-span-2 space-y-2">
              {/* Select all */}
              <div className="flex items-center gap-2 px-1 pb-1">
                <input type="checkbox" checked={selected_ids.size === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll} className="accent-[#4ade80] w-4 h-4 cursor-pointer" />
                <span className="font-body text-xs text-neutral-cream/40">Select all ({filtered.length})</span>
              </div>
              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
                {filtered.map((order, i) => (
                  <motion.div key={order.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selected?.id === order.id ? 'border-accent-glow/50 bg-accent-glow/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                    onClick={() => setSelected(order)}
                  >
                    <div onClick={(e) => { e.stopPropagation(); toggleSelect(order.id); }} className="pt-0.5">
                      <input type="checkbox" checked={selected_ids.has(order.id)} onChange={() => toggleSelect(order.id)}
                        className="accent-[#4ade80] w-4 h-4 cursor-pointer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading font-semibold text-xs text-neutral-cream truncate">{order.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize flex-shrink-0 ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                      </div>
                      <p className="font-body text-xs text-neutral-cream/70 mt-0.5">{order.delivery.name}</p>
                      <p className="font-body text-xs text-neutral-cream/40">{order.delivery.phone}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="font-body text-[10px] text-neutral-cream/30">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        <span className="font-heading font-bold text-sm text-accent-glow">₹{order.totalPrice}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div key={selected.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 sticky top-24"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h2 className="font-heading font-bold text-base text-neutral-cream">{selected.id}</h2>
                        <p className="font-body text-xs text-neutral-cream/40">{new Date(selected.createdAt).toLocaleString('en-IN')}</p>
                        {selected.userEmail && <p className="font-body text-xs text-neutral-cream/40 mt-0.5">📧 {selected.userEmail}</p>}
                      </div>
                      <select value={selected.status} onChange={(e) => handleStatusChange(selected.id, e.target.value as OrderStatus)}
                        className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-neutral-cream font-body text-sm focus:outline-none focus:border-accent-glow/60 capitalize">
                        {STATUSES.map((s) => <option key={s} value={s} className="bg-[#0F172A] capitalize">{STATUS_ICONS[s]} {s}</option>)}
                      </select>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="font-heading font-semibold text-xs text-neutral-cream/40 uppercase tracking-wider mb-2">Items</p>
                      <div className="space-y-2">
                        {selected.items.map((item) => (
                          <div key={item.productId} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
                            {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg bg-white/5 flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="font-body text-sm text-neutral-cream truncate">{item.name}</p>
                              <p className="font-body text-xs text-neutral-cream/50">Qty: {item.quantity} × ₹{item.price}</p>
                            </div>
                            <p className="font-heading font-bold text-sm text-accent-glow flex-shrink-0">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 pt-2 border-t border-white/10">
                        <span className="font-body text-sm text-neutral-cream/50">Total</span>
                        <span className="font-heading font-bold text-accent-glow">₹{selected.totalPrice}</span>
                      </div>
                    </div>

                    {/* Delivery + Payment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                      <div>
                        <p className="font-heading font-semibold text-xs text-neutral-cream/40 uppercase tracking-wider mb-2">Delivery</p>
                        <p className="font-body text-sm text-neutral-cream/80 leading-relaxed">
                          {selected.delivery.name}<br />
                          {selected.delivery.phone}<br />
                          {selected.delivery.address}<br />
                          {selected.delivery.city}, {selected.delivery.state} – {selected.delivery.pincode}
                        </p>
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-xs text-neutral-cream/40 uppercase tracking-wider mb-2">Payment</p>
                        <p className="font-body text-sm text-neutral-cream/80">{PAYMENT_LABELS[selected.paymentMethod]}</p>
                        <p className="font-heading font-semibold text-xs text-neutral-cream/40 uppercase tracking-wider mt-3 mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_COLORS[selected.status]}`}>
                          {STATUS_ICONS[selected.status]} {selected.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-neutral-cream/20 font-body text-sm gap-2">
                    <span className="text-3xl">👈</span>
                    Select an order to view details
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
        </>)}

        {/* ── MESSAGES TAB ── */}
        {tab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-2">
              {messages.length === 0 ? (
                <div className="text-center py-20 text-neutral-cream/30 font-body text-sm">No messages yet</div>
              ) : messages.map((msg, i) => (
                <motion.div key={msg.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedMsg?.id === msg.id ? 'border-accent-glow/50 bg-accent-glow/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  onClick={() => { setSelectedMsg(msg); if (!msg.read) { markMessageRead(msg.id); setMessages(getContactMessages()); } }}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-heading font-semibold text-sm text-neutral-cream truncate">{msg.name}</span>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-accent-glow flex-shrink-0" />}
                  </div>
                  <p className="font-body text-xs text-neutral-cream/50 truncate">{msg.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-body text-[10px] text-neutral-cream/30">{new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <button onClick={(e) => { e.stopPropagation(); deleteContactMessage(msg.id); setMessages(getContactMessages()); if (selectedMsg?.id === msg.id) setSelectedMsg(null); }}
                      className="text-red-400/50 hover:text-red-400 text-xs transition-colors">🗑</button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {selectedMsg ? (
                  <motion.div key={selectedMsg.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 sticky top-24"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-heading font-bold text-lg text-neutral-cream">{selectedMsg.name}</h2>
                        <p className="font-body text-xs text-neutral-cream/40">{new Date(selectedMsg.createdAt).toLocaleString('en-IN')}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{selectedMsg.read ? 'Read' : 'Unread'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="font-body text-xs text-neutral-cream/40 mb-0.5">Email</p><p className="font-body text-neutral-cream/80">{selectedMsg.email}</p></div>
                      {selectedMsg.phone && <div><p className="font-body text-xs text-neutral-cream/40 mb-0.5">Phone</p><p className="font-body text-neutral-cream/80">{selectedMsg.phone}</p></div>}
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-body text-xs text-neutral-cream/40 mb-2 uppercase tracking-wider">Message</p>
                      <p className="font-body text-sm text-neutral-cream/80 leading-relaxed whitespace-pre-wrap">{selectedMsg.message}</p>
                    </div>
                    <a href={`mailto:${selectedMsg.email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-glow/10 border border-accent-glow/20 text-accent-glow font-body text-sm hover:bg-accent-glow/20 transition-colors">
                      📧 Reply via Email
                    </a>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-neutral-cream/20 font-body text-sm gap-2">
                    <span className="text-3xl">✉️</span>
                    Select a message to read
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── SUBSCRIBERS TAB ── */}
        {tab === 'subscribers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-cream/30 text-sm">🔍</span>
                <input value={subSearch} onChange={(e) => setSubSearch(e.target.value)}
                  placeholder="Search email…"
                  className="w-full pl-8 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-cream placeholder-neutral-cream/30 font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
              </div>
              <span className="font-body text-sm text-neutral-cream/40">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</span>
            </div>

            {subscribers.length === 0 ? (
              <div className="text-center py-20 text-neutral-cream/30 font-body text-sm">No subscribers yet</div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-3 text-left text-xs text-neutral-cream/40 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs text-neutral-cream/40 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs text-neutral-cream/40 uppercase tracking-wider">Subscribed On</th>
                      <th className="px-4 py-3 text-left text-xs text-neutral-cream/40 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers
                      .filter((s) => !subSearch || s.email.toLowerCase().includes(subSearch.toLowerCase()))
                      .map((sub, i) => (
                        <motion.tr key={sub.email} className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                          <td className="px-4 py-3 text-neutral-cream/30 text-xs">{i + 1}</td>
                          <td className="px-4 py-3 text-neutral-cream/80">{sub.email}</td>
                          <td className="px-4 py-3 text-neutral-cream/40 text-xs">{new Date(sub.subscribedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => { deleteSubscriber(sub.email); setSubscribers(getSubscribers()); }}
                              className="text-red-400/50 hover:text-red-400 text-xs transition-colors font-body">Remove</button>
                          </td>
                        </motion.tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="font-body text-sm text-neutral-cream/40">{adminProducts.length} product{adminProducts.length !== 1 ? 's' : ''}</span>
              <button
                onClick={() => { setEditingProduct(null); setProductForm({ inStock: true, featured: false, currency: 'INR', category: 'seeds-mixes' }); setShowProductForm(true); }}
                className="px-4 py-2 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-xs transition-colors">
                + Add Product
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {['Image', 'Name', 'Price', 'Category', 'Stock', 'Featured', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs text-neutral-cream/40 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminProducts.map((p, i) => (
                    <motion.tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                      <td className="px-4 py-3">
                        <img src={p.images.thumbnail} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-white/5" />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-neutral-cream/80 font-semibold">{p.name}</p>
                        <p className="text-neutral-cream/40 text-xs truncate max-w-[200px]">{p.description}</p>
                      </td>
                      <td className="px-4 py-3 text-accent-glow font-heading font-bold">₹{p.price}</td>
                      <td className="px-4 py-3 text-neutral-cream/50 text-xs capitalize">{p.category}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${p.inStock ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {p.inStock ? 'In Stock' : 'Out'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${p.featured ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-white/5 text-neutral-cream/30 border-white/10'}`}>
                          {p.featured ? '★ Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditingProduct(p); setProductForm({ ...p }); setShowProductForm(true); }}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-cream/70 text-xs transition-colors">
                            Edit
                          </button>
                          <button
                            onClick={() => { if (confirm(`Delete "${p.name}"?`)) { deleteProduct(p.id); setAdminProducts(getProducts()); } }}
                            className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Product Form Modal */}
            <AnimatePresence>
              {showProductForm && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowProductForm(false)}>
                  <motion.div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4"
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-heading font-bold text-lg text-neutral-cream">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Name', key: 'name', type: 'text' },
                        { label: 'Price (₹)', key: 'price', type: 'number' },
                        { label: 'Slug', key: 'slug', type: 'text' },
                        { label: 'Category', key: 'category', type: 'text' },
                      ].map(({ label, key, type }) => (
                        <div key={key}>
                          <label className="block text-xs text-neutral-cream/40 mb-1">{label}</label>
                          <input type={type} value={(productForm as Record<string, unknown>)[key] as string ?? ''}
                            onChange={(e) => setProductForm((f) => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-cream font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-cream/40 mb-1">Description</label>
                      <textarea value={productForm.description ?? ''} rows={2}
                        onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-cream font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-cream/40 mb-1">Product Image</label>
                      {/* Upload button */}
                      <label className="flex items-center gap-3 cursor-pointer w-full px-3 py-2.5 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-accent-glow/50 transition-colors">
                        <span className="text-lg">📁</span>
                        <span className="font-body text-sm text-neutral-cream/50">
                          {productForm.images?.thumbnail ? 'Change image' : 'Upload image'}
                        </span>
                        <input type="file" accept="image/*" className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const dataUrl = ev.target?.result as string;
                              setProductForm((f) => ({ ...f, images: { ...(f.images ?? { thumbnail: '', main: '', gallery: [] }), thumbnail: dataUrl, main: dataUrl } }));
                            };
                            reader.readAsDataURL(file);
                          }} />
                      </label>
                      {/* URL fallback */}
                      <input type="text" placeholder="…or paste image URL"
                        value={productForm.images?.thumbnail?.startsWith('data:') ? '' : (productForm.images?.thumbnail ?? '')}
                        onChange={(e) => setProductForm((f) => ({ ...f, images: { ...(f.images ?? { thumbnail: '', main: '', gallery: [] }), thumbnail: e.target.value, main: e.target.value } }))}
                        className="w-full mt-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-cream font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors placeholder-neutral-cream/20" />
                      {/* Preview */}
                      {productForm.images?.thumbnail && (
                        <div className="relative mt-2 w-24 h-24">
                          <img src={productForm.images.thumbnail} alt="preview" className="w-24 h-24 object-contain rounded-xl border border-white/10 bg-white/5" />
                          <button type="button" onClick={() => setProductForm((f) => ({ ...f, images: { ...(f.images ?? { thumbnail: '', main: '', gallery: [] }), thumbnail: '', main: '' } }))}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-400 transition-colors">✕</button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={productForm.inStock ?? true}
                          onChange={(e) => setProductForm((f) => ({ ...f, inStock: e.target.checked }))}
                          className="accent-[#4ade80] w-4 h-4" />
                        <span className="text-sm text-neutral-cream/70 font-body">In Stock</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={productForm.featured ?? false}
                          onChange={(e) => setProductForm((f) => ({ ...f, featured: e.target.checked }))}
                          className="accent-[#4ade80] w-4 h-4" />
                        <span className="text-sm text-neutral-cream/70 font-body">Featured</span>
                      </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setShowProductForm(false)}
                        className="flex-1 py-2.5 rounded-xl border border-white/10 text-neutral-cream/50 font-body text-sm hover:border-white/20 transition-colors">
                        Cancel
                      </button>
                      <button onClick={() => {
                        if (!productForm.name || !productForm.price) return;
                        if (editingProduct) {
                          updateProduct(productForm as Product);
                        } else {
                          const newP: Product = {
                            ...(productForm as Product),
                            id: 'prod-' + Date.now().toString(36),
                            currency: 'INR',
                            images: productForm.images ?? { thumbnail: '', main: '', gallery: [] },
                            ingredients: [],
                            nutrition: { servingSize: '', servingsPerContainer: 0, calories: 0, nutrients: [] },
                            benefits: [],
                            usage: [],
                            seo: { title: productForm.name ?? '', description: productForm.description ?? '', keywords: [], ogImage: productForm.images?.thumbnail ?? '', structuredData: {} },
                          };
                          addProduct(newP);
                        }
                        setAdminProducts(getProducts());
                        setShowProductForm(false);
                      }}
                        className="flex-1 py-2.5 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors">
                        {editingProduct ? 'Save Changes' : 'Add Product'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── FEEDBACK TAB ── */}
        {tab === 'feedback' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-body text-sm text-neutral-cream/40">{feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''}</span>
            </div>
            {feedbacks.length === 0 ? (
              <div className="text-center py-20 text-neutral-cream/30 font-body text-sm">No feedback yet</div>
            ) : (
              <div className="space-y-3">
                {feedbacks.map((fb, i) => (
                  <motion.div key={fb.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <div className="w-10 h-10 rounded-full bg-accent-glow/20 flex items-center justify-center text-accent-glow font-heading font-bold text-sm flex-shrink-0">
                      {fb.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-semibold text-sm text-neutral-cream">{fb.author}</span>
                        <span className="text-neutral-cream/30 text-xs">{fb.location}</span>
                        <span className="text-yellow-400 text-xs">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</span>
                      </div>
                      <p className="font-body text-xs text-accent-glow/70 mt-0.5">{fb.productName}</p>
                      <p className="font-body text-sm text-neutral-cream/70 mt-1 leading-relaxed">{fb.text}</p>
                      <p className="font-body text-[10px] text-neutral-cream/30 mt-1">{new Date(fb.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · Order: {fb.orderId}</p>
                    </div>
                    <button
                      onClick={() => { if (confirm('Delete this review?')) { deleteFeedback(fb.id); setFeedbacks(getProductFeedbacks()); } }}
                      className="text-red-400/50 hover:text-red-400 text-sm transition-colors flex-shrink-0">🗑</button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── INSTAGRAM TAB ── */}
        {tab === 'instagram' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="font-body text-sm text-neutral-cream/40">{igPosts.length} post{igPosts.length !== 1 ? 's' : ''}</span>
              <button
                onClick={() => { setEditingIg(null); setIgForm({}); setShowIgForm(true); }}
                className="px-4 py-2 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-xs transition-colors">
                + Add Post
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {igPosts.map((post, i) => (
                <motion.div key={post.id} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                  <img src={post.image} alt={post.caption} className="w-full aspect-square object-cover" />
                  <div className="p-3 space-y-1">
                    <p className="font-body text-xs text-neutral-cream/70 line-clamp-2">{post.caption}</p>
                    {post.likes !== undefined && <p className="font-body text-[10px] text-accent-glow">♥ {post.likes}</p>}
                  </div>
                  <div className="flex gap-2 px-3 pb-3">
                    <button
                      onClick={() => { setEditingIg(post); setIgForm({ ...post }); setShowIgForm(true); }}
                      className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-cream/70 text-xs transition-colors">
                      Edit
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this post?')) { deleteInstagramPost(post.id); setIgPosts(getInstagramPosts()); } }}
                      className="flex-1 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors">
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Instagram Form Modal */}
            <AnimatePresence>
              {showIgForm && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowIgForm(false)}>
                  <motion.div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4"
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-heading font-bold text-lg text-neutral-cream">{editingIg ? 'Edit Post' : 'Add Post'}</h3>
                    {[
                      { label: 'Image URL', key: 'image', type: 'text' },
                      { label: 'Caption', key: 'caption', type: 'text' },
                      { label: 'Post URL', key: 'url', type: 'text' },
                      { label: 'Likes', key: 'likes', type: 'number' },
                    ].map(({ label, key, type }) => (
                      <div key={key}>
                        <label className="block text-xs text-neutral-cream/40 mb-1">{label}</label>
                        <input type={type} value={(igForm as Record<string, unknown>)[key] as string ?? ''}
                          onChange={(e) => setIgForm((f) => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-cream font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
                      </div>
                    ))}
                    {igForm.image && (
                      <img src={igForm.image} alt="preview" className="w-full h-48 object-cover rounded-xl border border-white/10" />
                    )}
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setShowIgForm(false)}
                        className="flex-1 py-2.5 rounded-xl border border-white/10 text-neutral-cream/50 font-body text-sm hover:border-white/20 transition-colors">
                        Cancel
                      </button>
                      <button onClick={() => {
                        if (!igForm.image || !igForm.caption) return;
                        if (editingIg) {
                          updateInstagramPost(igForm as InstagramPost);
                        } else {
                          addInstagramPost({ ...(igForm as InstagramPost), id: 'ig-' + Date.now().toString(36) });
                        }
                        setIgPosts(getInstagramPosts());
                        setShowIgForm(false);
                      }}
                        className="flex-1 py-2.5 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors">
                        {editingIg ? 'Save Changes' : 'Add Post'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
