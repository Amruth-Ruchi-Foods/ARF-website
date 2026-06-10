import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { db } from '../db/store';

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

/**
 * POST /api/payment/create-order
 * Create a Razorpay order
 */
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Validate amount (minimum 100 paise = 1 INR)
    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least 100 paise (1 INR)',
      });
    }

    // Create order options
    const options = {
      amount: amount, // amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    // Create order via Razorpay API
    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    
    if (error.statusCode === 401) {
      return res.status(401).json({
        success: false,
        message: 'Razorpay authentication failed. Check credentials.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});

/**
 * POST /api/payment/verify
 * Verify Razorpay payment signature
 */
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId, // Your internal order ID
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields',
      });
    }

    // Generate signature for verification
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Compare signatures
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.',
      });
    }

    // Signature is valid - Update order status in database
    if (orderId) {
      try {
        await db.updateOrderPaymentStatus(
          orderId,
          'paid',
          razorpay_payment_id,
          razorpay_order_id
        );
      } catch (dbError) {
        console.error('Error updating order status:', dbError);
        // Payment is verified but DB update failed - log for manual intervention
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification error',
      error: error.message,
    });
  }
});

/**
 * GET /api/payment/key
 * Get Razorpay public key for frontend
 */
router.get('/key', (req, res) => {
  res.json({
    key: process.env.RAZORPAY_KEY_ID || '',
  });
});

export default router;
