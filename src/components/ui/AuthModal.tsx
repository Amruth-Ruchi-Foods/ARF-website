import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserAuth } from '../../context/UserAuthContext';
import { ProfileModal } from './ProfileModal';

export function AuthModal() {
  const { authModal, closeModal, openLogin, openSignup, login, signup } = useUserAuth();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const reset = () => { setName(''); setEmail(''); setPhone(''); setPassword(''); setError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 400));
    const err = authModal === 'login'
      ? login(email, password)
      : signup(name, email, phone, password);
    if (err) setError(err);
    else reset();
    setLoading(false);
  };

  const switchMode = () => {
    reset();
    authModal === 'login' ? openSignup() : openLogin();
  };

  if (authModal === 'profile') {
    return <ProfileModal onClose={closeModal} />;
  }

  return (
    <AnimatePresence>
      {authModal && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeModal}
          />
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm bg-[#0F172A] border border-white/10 rounded-2xl p-6 shadow-2xl"
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading font-bold text-xl text-neutral-cream">
                    {authModal === 'login' ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="font-body text-xs text-neutral-cream/40 mt-0.5">
                    {authModal === 'login' ? 'Sign in to view your orders' : 'Join ARF to start ordering'}
                  </p>
                </div>
                <button onClick={closeModal} className="text-neutral-cream/40 hover:text-neutral-cream transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {authModal === 'signup' && (
                  <div>
                    <label className="block text-xs text-neutral-cream/50 mb-1">Full Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream placeholder-neutral-cream/30 font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-neutral-cream/50 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream placeholder-neutral-cream/30 font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
                </div>
                {authModal === 'signup' && (
                  <div>
                    <label className="block text-xs text-neutral-cream/50 mb-1">Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="10-digit mobile number" maxLength={10}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream placeholder-neutral-cream/30 font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-neutral-cream/50 mb-1">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder={authModal === 'signup' ? 'Min 6 characters' : 'Your password'}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream placeholder-neutral-cream/30 font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
                </div>

                {error && <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors disabled:opacity-60 mt-1">
                  {loading ? '...' : authModal === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <p className="text-center font-body text-xs text-neutral-cream/40 mt-4">
                {authModal === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button onClick={switchMode} className="text-accent-glow hover:underline">
                  {authModal === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
