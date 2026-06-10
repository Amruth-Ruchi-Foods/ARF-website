import { Cart, Favorite, Order } from '../types/index.js';

// In-memory storage (replace with database in production)
export const carts = new Map<string, Cart>();
export const favorites = new Map<string, Favorite>();
export const orders = new Map<string, Order>();

// Helper to generate IDs
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Database operations
export const db = {
  /**
   * Update order payment status after Razorpay verification
   */
  updateOrderPaymentStatus: async (
    orderId: string,
    paymentStatus: string,
    razorpayPaymentId: string,
    razorpayOrderId: string
  ): Promise<void> => {
    const order = orders.get(orderId);
    if (order) {
      order.paymentStatus = paymentStatus;
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpayOrderId = razorpayOrderId;
      order.status = 'confirmed';
      orders.set(orderId, order);
    } else {
      throw new Error(`Order ${orderId} not found`);
    }
  },

  /**
   * Get order by ID
   */
  getOrder: (orderId: string): Order | undefined => {
    return orders.get(orderId);
  },

  /**
   * Create new order
   */
  createOrder: (order: Order): void => {
    orders.set(order.id, order);
  },
};
