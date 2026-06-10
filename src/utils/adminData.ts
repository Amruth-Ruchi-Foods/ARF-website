import type { Product } from '../types/product';
import type { InstagramPost } from '../data/instagram';
import { products as staticProducts } from '../data/products';
import { instagramPosts as staticInstagram } from '../data/instagram';

// ── Products ──────────────────────────────────────────────────────────────────
const PRODUCTS_KEY = 'arf_admin_products';

export function getProducts(): Product[] {
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    return saved ? JSON.parse(saved) : staticProducts;
  } catch { return staticProducts; }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function addProduct(product: Product): void {
  saveProducts([...getProducts(), product]);
}

export function updateProduct(updated: Product): void {
  saveProducts(getProducts().map((p) => p.id === updated.id ? updated : p));
}

export function deleteProduct(id: string): void {
  saveProducts(getProducts().filter((p) => p.id !== id));
}

// ── Instagram Posts ───────────────────────────────────────────────────────────
const INSTAGRAM_KEY = 'arf_admin_instagram';

export function getInstagramPosts(): InstagramPost[] {
  try {
    const saved = localStorage.getItem(INSTAGRAM_KEY);
    return saved ? JSON.parse(saved) : staticInstagram;
  } catch { return staticInstagram; }
}

export function saveInstagramPosts(posts: InstagramPost[]): void {
  localStorage.setItem(INSTAGRAM_KEY, JSON.stringify(posts));
}

export function addInstagramPost(post: InstagramPost): void {
  saveInstagramPosts([...getInstagramPosts(), post]);
}

export function updateInstagramPost(updated: InstagramPost): void {
  saveInstagramPosts(getInstagramPosts().map((p) => p.id === updated.id ? updated : p));
}

export function deleteInstagramPost(id: string): void {
  saveInstagramPosts(getInstagramPosts().filter((p) => p.id !== id));
}

// ── Feedback ──────────────────────────────────────────────────────────────────
export { getProductFeedbacks } from './leads';

export function deleteFeedback(id: string): void {
  try {
    const all = JSON.parse(localStorage.getItem('arf_product_feedback') || '[]');
    localStorage.setItem('arf_product_feedback', JSON.stringify(all.filter((f: { id: string }) => f.id !== id)));
  } catch {}
}
