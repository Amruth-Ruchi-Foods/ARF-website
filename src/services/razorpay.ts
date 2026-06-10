/**
 * Razorpay payment integration service
 */

import { api } from './api';

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CreateOrderParams {
  amount: number; // in paise
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResponse {
  success: boolean;
  order?: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
  message?: string;
}

export interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId?: string; // Your internal order ID
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  payment_id?: string;
  order_id?: string;
}

/**
 * Load Razorpay checkout script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Create Razorpay order via backend
 */
export const createRazorpayOrder = async (
  params: CreateOrderParams
): Promise<CreateOrderResponse> => {
  try {
    const response = await api.post('/payment/create-order', params);
    return response.data;
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create order',
    };
  }
};

/**
 * Verify payment signature via backend
 */
export const verifyPayment = async (
  params: VerifyPaymentParams
): Promise<VerifyPaymentResponse> => {
  try {
    const response = await api.post('/payment/verify', params);
    return response.data;
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Payment verification failed',
    };
  }
};

/**
 * Open Razorpay checkout modal
 */
export const openRazorpayCheckout = (options: RazorpayOptions): void => {
  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};

/**
 * Complete payment flow
 * 1. Create order
 * 2. Open Razorpay modal
 * 3. Handle payment response
 */
export interface InitiatePaymentParams {
  amount: number; // in rupees (will be converted to paise)
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  orderId?: string;
  notes?: Record<string, string>;
  onSuccess: (response: RazorpayResponse, verificationResult: VerifyPaymentResponse) => void;
  onFailure: (error: string) => void;
  onDismiss?: () => void;
}

export const initiatePayment = async ({
  amount,
  customerName,
  customerEmail,
  customerPhone,
  orderId,
  notes,
  onSuccess,
  onFailure,
  onDismiss,
}: InitiatePaymentParams): Promise<void> => {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      onFailure('Failed to load Razorpay. Please check your internet connection.');
      return;
    }

    // Convert amount to paise
    const amountInPaise = Math.round(amount * 100);

    // Create order
    const orderResult = await createRazorpayOrder({
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderId || `receipt_${Date.now()}`,
      notes,
    });

    if (!orderResult.success || !orderResult.order) {
      onFailure(orderResult.message || 'Failed to create order');
      return;
    }

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      onFailure('Razorpay configuration error. Please contact support.');
      return;
    }

    // Open Razorpay checkout
    const options: RazorpayOptions = {
      key: razorpayKeyId,
      amount: orderResult.order.amount,
      currency: orderResult.order.currency,
      name: 'ARF - Amruth Ruchi Foods',
      description: 'Order Payment',
      order_id: orderResult.order.id,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      notes: notes || {},
      theme: {
        color: '#2E7D32', // ARF green
      },
      handler: async (response: RazorpayResponse) => {
        // Verify payment
        const verificationResult = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId,
        });

        if (verificationResult.success) {
          onSuccess(response, verificationResult);
        } else {
          onFailure(verificationResult.message || 'Payment verification failed');
        }
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) {
            onDismiss();
          } else {
            onFailure('Payment cancelled');
          }
        },
      },
    };

    openRazorpayCheckout(options);
  } catch (error: any) {
    console.error('Payment error:', error);
    onFailure(error.message || 'Payment failed. Please try again.');
  }
};
