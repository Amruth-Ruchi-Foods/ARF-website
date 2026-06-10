export type PaymentMethod = 'cod' | 'upi' | 'card' | 'netbanking';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface DeliveryDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  delivery: DeliveryDetails;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt: string;
}

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
