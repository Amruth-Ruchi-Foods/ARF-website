import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';

export function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile, logout } = useUserAuth();
  const navigate = useNavigate();
  const [name, setName]       = useState(user?.name ?? '');
  const [phone, setPhone]     = useState(user?.phone ?? '');
  const [curPw, setCurPw]     = useState('');
  const [newPw, setNewPw]     = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving]   = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess(false);
    await new Promise((r) => setTimeout(r, 300));
    const err = updateProfile(name, phone, curPw, newPw || undefined);
    if (err) setError(err);
    else { setSuccess(true); setCurPw(''); setNewPw(''); }
    setSaving(false);
  };

  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    if (!confirmLogout) { setConfirmLogout(true); return; }
    logout(); navigate('/'); onClose();
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} />
      <motion.div className="fixed inset-0 z-[90] flex items-center justify-center px-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="w-full max-w-sm bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.93, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}>

          {/* Avatar header */}
          <div className="bg-gradient-to-br from-accent-glow/10 to-transparent px-6 pt-6 pb-4 flex items-center gap-4 border-b border-white/10">
            <div className="w-14 h-14 rounded-full bg-accent-glow/20 border-2 border-accent-glow/50 flex items-center justify-center text-accent-glow text-2xl font-bold font-heading flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-neutral-cream truncate">{user?.name}</p>
              <p className="font-body text-xs text-neutral-cream/40 truncate">{user?.email}</p>
            </div>
            <button onClick={onClose} className="text-neutral-cream/30 hover:text-neutral-cream transition-colors flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSave} className="px-6 py-5 space-y-3">
            <p className="font-heading font-semibold text-xs text-neutral-cream/40 uppercase tracking-wider">Edit Profile</p>

            <div>
              <label className="block text-xs text-neutral-cream/50 mb-1">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-neutral-cream/50 mb-1">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={10}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
            </div>

            <p className="font-heading font-semibold text-xs text-neutral-cream/40 uppercase tracking-wider pt-1">Change Password</p>
            <div>
              <label className="block text-xs text-neutral-cream/50 mb-1">Current Password <span className="text-neutral-cream/30">(required to save)</span></label>
              <input type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} required placeholder="••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-neutral-cream/50 mb-1">New Password <span className="text-neutral-cream/30">(leave blank to keep)</span></label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min 6 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-cream font-body text-sm focus:outline-none focus:border-accent-glow/60 transition-colors" />
            </div>

            {error   && <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}
            {success && <p className="text-accent-glow text-xs bg-accent-glow/10 border border-accent-glow/20 rounded-lg px-3 py-2">✓ Profile updated successfully</p>}

            <button type="submit" disabled={saving}
              className="w-full py-2.5 rounded-xl bg-accent-glow hover:bg-[#5ddb8a] text-[#0F172A] font-heading font-bold text-sm transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>

          <div className="px-6 pb-5">
            {confirmLogout ? (
              <div className="space-y-2">
                <p className="font-body text-xs text-neutral-cream/50 text-center">Are you sure you want to logout?</p>
                <div className="flex gap-2">
                  <button onClick={() => setConfirmLogout(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-neutral-cream/60 hover:bg-white/5 font-body text-sm transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleLogout}
                    className="flex-1 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-body text-sm transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={handleLogout}
                className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-body text-sm transition-colors">
                Logout
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
