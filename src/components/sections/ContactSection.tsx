import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { saveContactMessage } from '../../utils/leads';

const CONTACT_INFO = [
  { icon: '📍', label: 'Address',  value: 'Ground Floor, 45 Shop No 03, K G Lakkenahalli Main Road, Bengaluru Urban, Karnataka – 562123' },
  { icon: '📞', label: 'Phone',    value: '+91 91874 58799  |  +91 91874 58798' },
  { icon: '📧', label: 'Email',    value: 'AmruthRuchifoods@gmail.com' },
  { icon: '🌐', label: 'Website',  value: 'www.amruthruchifoods.in' },
  { icon: '🧾', label: 'GST No.',  value: '29AWAPM8282G2Z5' },
];

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 800));
    saveContactMessage({ name: form.name, email: form.email, phone: form.phone || undefined, message: form.message });
    setStatus('sent');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream placeholder-neutral-cream/30 font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors';

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-[#0F172A] py-24 px-4 overflow-hidden"
      aria-label="Contact us"
    >
      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,rgba(46,125,50,0.10)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(124,255,178,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-glow/10 border border-accent-glow/20 text-accent-glow font-body text-xs uppercase tracking-widest mb-4">
            Get in Touch
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-neutral-cream">
            We'd love to hear from you
          </h2>
          <p className="font-body text-neutral-cream/50 text-sm mt-3 max-w-md mx-auto">
            Questions about our products, bulk orders, or just want to say hello — reach out anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: -24 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}
          >
            {CONTACT_INFO.map((item) => (
              <div key={item.label} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-heading font-semibold text-xs text-neutral-cream/40 uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="font-body text-sm text-neutral-cream/80">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Social row */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="font-heading font-semibold text-xs text-neutral-cream/40 uppercase tracking-wider mb-3">Follow Us</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Instagram', href: 'https://instagram.com/amruthruchifoods',
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="url(#ig-grad)">
                        <defs>
                          <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
                            <stop offset="0%" stopColor="#fdf497"/>
                            <stop offset="5%" stopColor="#fdf497"/>
                            <stop offset="45%" stopColor="#fd5949"/>
                            <stop offset="60%" stopColor="#d6249f"/>
                            <stop offset="90%" stopColor="#285AEB"/>
                          </radialGradient>
                        </defs>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )
                  },
                  { label: 'Facebook',  href: 'https://facebook.com/amruthruchifoods',
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )
                  },
                  { label: 'YouTube',   href: 'https://youtube.com/amruthruchifoods',
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="#FF0000">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )
                  },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-accent-glow/40 hover:bg-accent-glow/5 transition-colors font-body text-xs text-neutral-cream/60 hover:text-neutral-cream">
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 24 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              {status === 'sent' ? (
                <motion.div className="text-center py-12" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-heading font-bold text-xl text-neutral-cream mb-2">Message sent!</h3>
                  <p className="font-body text-neutral-cream/50 text-sm mb-6">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setStatus('idle')}
                    className="px-5 py-2 rounded-xl border border-white/10 text-neutral-cream/60 hover:text-neutral-cream font-body text-sm transition-colors">
                    Send another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-cream/50 mb-1">Name *</label>
                      <input value={form.name} onChange={set('name')} required placeholder="Your name" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-cream/50 mb-1">Phone</label>
                      <input value={form.phone} onChange={set('phone')} placeholder="10-digit number" maxLength={10} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-cream/50 mb-1">Email *</label>
                    <input type="email" value={form.email} onChange={set('email')} required placeholder="your@email.com" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-cream/50 mb-1">Message *</label>
                    <textarea value={form.message} onChange={set('message')} required rows={4} placeholder="How can we help you?"
                      className={inputCls + ' resize-none'} />
                  </div>
                  <button type="submit" disabled={status === 'sending'}
                    className="w-full py-3 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors disabled:opacity-60">
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
