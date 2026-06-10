import type { Order, OrderStatus } from '../types/order';

const KEY = 'arf_orders';

export function getOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  const orders = getOrders().map((o) =>
    o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
  );
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function generateOrderId(): string {
  return 'ARF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export function getOrdersByEmail(email: string): Order[] {
  return getOrders().filter((o) => o.userEmail?.toLowerCase() === email.toLowerCase());
}
