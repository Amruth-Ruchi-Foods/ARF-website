import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance for API calls
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CartItem {
  productId: string;
  quantity: number;
  variantId?: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface Favorite {
  userId: string;
  productIds: string[];
  updatedAt: string;
}

// Cart API
export const cartApi = {
  getCart: async (userId: string): Promise<Cart> => {
    const res = await fetch(`${API_BASE_URL}/api/cart/${userId}`);
    return res.json();
  },

  addItem: async (userId: string, productId: string, quantity: number, variantId?: string): Promise<Cart> => {
    const res = await fetch(`${API_BASE_URL}/api/cart/${userId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity, variantId })
    });
    return res.json();
  },

  updateItem: async (userId: string, productId: string, quantity: number, variantId?: string): Promise<Cart> => {
    const res = await fetch(`${API_BASE_URL}/api/cart/${userId}/items/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity, variantId })
    });
    return res.json();
  },

  removeItem: async (userId: string, productId: string, variantId?: string): Promise<Cart> => {
    const url = new URL(`${API_BASE_URL}/api/cart/${userId}/items/${productId}`);
    if (variantId) url.searchParams.set('variantId', variantId);
    const res = await fetch(url.toString(), { method: 'DELETE' });
    return res.json();
  },

  clearCart: async (userId: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/api/cart/${userId}`, { method: 'DELETE' });
  }
};

// Favorites API
export const favoritesApi = {
  getFavorites: async (userId: string): Promise<Favorite> => {
    const res = await fetch(`${API_BASE_URL}/api/favorites/${userId}`);
    return res.json();
  },

  addFavorite: async (userId: string, productId: string): Promise<Favorite> => {
    const res = await fetch(`${API_BASE_URL}/api/favorites/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    return res.json();
  },

  removeFavorite: async (userId: string, productId: string): Promise<Favorite> => {
    const res = await fetch(`${API_BASE_URL}/api/favorites/${userId}/${productId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  clearFavorites: async (userId: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/api/favorites/${userId}`, { method: 'DELETE' });
  }
};

// Orders API
export const ordersApi = {
  createOrder: async (orderData: {
    items: Array<{ productId: string; name: string; price: number; quantity: number; image?: string }>;
    delivery: {
      name: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
    };
    paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
    totalPrice: number;
    userEmail?: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  getOrder: async (orderId: string) => {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
    return res.json();
  },

  getUserOrders: async (userEmail: string) => {
    const res = await fetch(`${API_BASE_URL}/api/orders/user/${userEmail}`);
    return res.json();
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  cancelOrder: async (orderId: string) => {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
      method: 'POST'
    });
    return res.json();
  },

  getAllOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/api/orders`);
    return res.json();
  }
};
