export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
}

const CONTACT_KEY    = 'arf_contact_messages';
const NEWSLETTER_KEY = 'arf_newsletter';

export function getContactMessages(): ContactMessage[] {
  try { return JSON.parse(localStorage.getItem(CONTACT_KEY) || '[]'); } catch { return []; }
}

export function saveContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): void {
  const msgs = getContactMessages();
  msgs.unshift({ ...msg, id: 'MSG-' + Date.now().toString(36).toUpperCase(), createdAt: new Date().toISOString(), read: false });
  localStorage.setItem(CONTACT_KEY, JSON.stringify(msgs));
}

export function markMessageRead(id: string): void {
  const msgs = getContactMessages().map((m) => m.id === id ? { ...m, read: true } : m);
  localStorage.setItem(CONTACT_KEY, JSON.stringify(msgs));
}

export function deleteContactMessage(id: string): void {
  const msgs = getContactMessages().filter((m) => m.id !== id);
  localStorage.setItem(CONTACT_KEY, JSON.stringify(msgs));
}

export function getSubscribers(): NewsletterSubscriber[] {
  try { return JSON.parse(localStorage.getItem(NEWSLETTER_KEY) || '[]'); } catch { return []; }
}

export function saveSubscriber(email: string): string | null {
  const subs = getSubscribers();
  if (subs.find((s) => s.email.toLowerCase() === email.toLowerCase())) return 'Already subscribed';
  subs.unshift({ email, subscribedAt: new Date().toISOString() });
  localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subs));
  return null;
}

export function deleteSubscriber(email: string): void {
  const subs = getSubscribers().filter((s) => s.email !== email);
  localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subs));
}

// ── Product Feedback ──────────────────────────────────────────────────────────

export interface ProductFeedback {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  author: string;
  location: string;
  rating: number;
  text: string;
  createdAt: string;
}

const FEEDBACK_KEY = 'arf_product_feedback';

export function getProductFeedbacks(): ProductFeedback[] {
  try { return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]'); } catch { return []; }
}

/** Save feedback only if rating >= 4 (good). Returns true if saved. */
export function saveProductFeedback(fb: Omit<ProductFeedback, 'id' | 'createdAt'>): boolean {
  if (fb.rating < 4) return false;
  const all = getProductFeedbacks();
  all.unshift({ ...fb, id: 'FB-' + Date.now().toString(36).toUpperCase(), createdAt: new Date().toISOString() });
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all));
  return true;
}

/** Check if user already submitted feedback for a specific order+product */
export function hasFeedback(orderId: string, productId: string): boolean {
  return getProductFeedbacks().some((f) => f.orderId === orderId && f.productId === productId);
}
