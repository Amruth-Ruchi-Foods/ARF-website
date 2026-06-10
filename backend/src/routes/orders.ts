import { Router } from 'express';
import { orders, generateId } from '../db/store.js';
import { Order } from '../types/index.js';

const router = Router();

// Get all orders for a user
router.get('/user/:userEmail', (req, res) => {
  const { userEmail } = req.params;
  const userOrders = Array.from(orders.values())
    .filter(order => order.userEmail === userEmail)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  res.json(userOrders);
});

// Get order by ID
router.get('/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orders.get(orderId);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json(order);
});

// Create new order
router.post('/', (req, res) => {
  const { items, delivery, paymentMethod, totalPrice, userEmail } = req.body;
  
  if (!items || !delivery || !paymentMethod || !totalPrice) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const orderId = generateId();
  const now = new Date().toISOString();
  
  const order: Order = {
    id: orderId,
    items,
    delivery,
    paymentMethod,
    totalPrice,
    status: 'pending',
    userEmail,
    createdAt: now,
    updatedAt: now
  };
  
  orders.set(orderId, order);
  
  res.status(201).json(order);
});

// Update order status
router.patch('/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  
  const order = orders.get(orderId);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  order.status = status;
  order.updatedAt = new Date().toISOString();
  orders.set(orderId, order);
  
  res.json(order);
});

// Cancel order
router.post('/:orderId/cancel', (req, res) => {
  const { orderId } = req.params;
  const order = orders.get(orderId);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  if (['shipped', 'delivered'].includes(order.status)) {
    return res.status(400).json({ error: 'Cannot cancel order in current status' });
  }
  
  order.status = 'cancelled';
  order.updatedAt = new Date().toISOString();
  orders.set(orderId, order);
  
  res.json(order);
});

// Get all orders (admin)
router.get('/', (req, res) => {
  const allOrders = Array.from(orders.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  res.json(allOrders);
});

export default router;
