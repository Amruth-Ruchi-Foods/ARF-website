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
  userEmail?: string;
  createdAt: string;
  updatedAt: string;
}
