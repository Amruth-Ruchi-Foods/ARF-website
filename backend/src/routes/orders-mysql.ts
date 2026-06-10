import { Router } from 'express';
import { pool } from '../db/connection.js';

const router = Router();

function generateOrderId() {
  return `ORD${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

// Get all orders for a user
router.get('/user/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    
    const [orders] = await pool.query(
      `SELECT id, user_email as userEmail, 
        delivery_name, delivery_phone, delivery_email, 
        delivery_address, delivery_city, delivery_state, delivery_pincode,
        payment_method as paymentMethod, total_price as totalPrice, 
        status, created_at as createdAt, updated_at as updatedAt
       FROM orders 
       WHERE user_email = ? 
       ORDER BY created_at DESC`,
      [userEmail]
    );
    
    // Get items for each order
    const ordersWithItems = await Promise.all(
      (orders as any[]).map(async (order) => {
        const [items] = await pool.query(
          'SELECT product_id as productId, name, price, quantity, image FROM order_items WHERE order_id = ?',
          [order.id]
        );
        
        return {
          ...order,
          delivery: {
            name: order.delivery_name,
            phone: order.delivery_phone,
            email: order.delivery_email,
            address: order.delivery_address,
            city: order.delivery_city,
            state: order.delivery_state,
            pincode: order.delivery_pincode
          },
          items,
          userEmail: order.userEmail
        };
      })
    );
    
    res.json(ordersWithItems);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const [orders] = await pool.query(
      `SELECT id, user_email as userEmail,
        delivery_name, delivery_phone, delivery_email,
        delivery_address, delivery_city, delivery_state, delivery_pincode,
        payment_method as paymentMethod, total_price as totalPrice,
        status, created_at as createdAt, updated_at as updatedAt
       FROM orders 
       WHERE id = ?`,
      [orderId]
    );
    
    if ((orders as any[]).length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = (orders as any[])[0];
    
    const [items] = await pool.query(
      'SELECT product_id as productId, name, price, quantity, image FROM order_items WHERE order_id = ?',
      [orderId]
    );
    
    res.json({
      ...order,
      delivery: {
        name: order.delivery_name,
        phone: order.delivery_phone,
        email: order.delivery_email,
        address: order.delivery_address,
        city: order.delivery_city,
        state: order.delivery_state,
        pincode: order.delivery_pincode
      },
      items,
      userEmail: order.userEmail
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, delivery, paymentMethod, totalPrice, userEmail } = req.body;
    
    if (!items || !delivery || !paymentMethod || !totalPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const orderId = generateOrderId();
    const now = new Date();
    
    // Insert order
    await pool.query(
      `INSERT INTO orders 
       (id, user_email, delivery_name, delivery_phone, delivery_email, 
        delivery_address, delivery_city, delivery_state, delivery_pincode, 
        payment_method, total_price, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [
        orderId, userEmail, delivery.name, delivery.phone, delivery.email,
        delivery.address, delivery.city, delivery.state, delivery.pincode,
        paymentMethod, totalPrice, now, now
      ]
    );
    
    // Insert order items
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, name, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.productId, item.name, item.price, item.quantity, item.image || null]
      );
    }
    
    res.status(201).json({
      id: orderId,
      items,
      delivery,
      paymentMethod,
      totalPrice,
      status: 'pending',
      userEmail,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const [result] = await pool.query(
      'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?',
      [status, new Date(), orderId]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Get updated order
    const [orders] = await pool.query(
      `SELECT id, user_email as userEmail,
        delivery_name, delivery_phone, delivery_email,
        delivery_address, delivery_city, delivery_state, delivery_pincode,
        payment_method as paymentMethod, total_price as totalPrice,
        status, created_at as createdAt, updated_at as updatedAt
       FROM orders 
       WHERE id = ?`,
      [orderId]
    );
    
    const order = (orders as any[])[0];
    
    const [items] = await pool.query(
      'SELECT product_id as productId, name, price, quantity, image FROM order_items WHERE order_id = ?',
      [orderId]
    );
    
    res.json({
      ...order,
      delivery: {
        name: order.delivery_name,
        phone: order.delivery_phone,
        email: order.delivery_email,
        address: order.delivery_address,
        city: order.delivery_city,
        state: order.delivery_state,
        pincode: order.delivery_pincode
      },
      items,
      userEmail: order.userEmail
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Cancel order
router.post('/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const [orders] = await pool.query(
      'SELECT status FROM orders WHERE id = ?',
      [orderId]
    );
    
    if ((orders as any[]).length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = (orders as any[])[0];
    
    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel order in current status' });
    }
    
    await pool.query(
      'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?',
      ['cancelled', new Date(), orderId]
    );
    
    // Get updated order
    const [updatedOrders] = await pool.query(
      `SELECT id, user_email as userEmail,
        delivery_name, delivery_phone, delivery_email,
        delivery_address, delivery_city, delivery_state, delivery_pincode,
        payment_method as paymentMethod, total_price as totalPrice,
        status, created_at as createdAt, updated_at as updatedAt
       FROM orders 
       WHERE id = ?`,
      [orderId]
    );
    
    const updatedOrder = (updatedOrders as any[])[0];
    
    const [items] = await pool.query(
      'SELECT product_id as productId, name, price, quantity, image FROM order_items WHERE order_id = ?',
      [orderId]
    );
    
    res.json({
      ...updatedOrder,
      delivery: {
        name: updatedOrder.delivery_name,
        phone: updatedOrder.delivery_phone,
        email: updatedOrder.delivery_email,
        address: updatedOrder.delivery_address,
        city: updatedOrder.delivery_city,
        state: updatedOrder.delivery_state,
        pincode: updatedOrder.delivery_pincode
      },
      items,
      userEmail: updatedOrder.userEmail
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT id, user_email as userEmail,
        delivery_name, delivery_phone, delivery_email,
        delivery_address, delivery_city, delivery_state, delivery_pincode,
        payment_method as paymentMethod, total_price as totalPrice,
        status, created_at as createdAt, updated_at as updatedAt
       FROM orders 
       ORDER BY created_at DESC`
    );
    
    // Get items for each order
    const ordersWithItems = await Promise.all(
      (orders as any[]).map(async (order) => {
        const [items] = await pool.query(
          'SELECT product_id as productId, name, price, quantity, image FROM order_items WHERE order_id = ?',
          [order.id]
        );
        
        return {
          ...order,
          delivery: {
            name: order.delivery_name,
            phone: order.delivery_phone,
            email: order.delivery_email,
            address: order.delivery_address,
            city: order.delivery_city,
            state: order.delivery_state,
            pincode: order.delivery_pincode
          },
          items,
          userEmail: order.userEmail
        };
      })
    );
    
    res.json(ordersWithItems);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

export default router;
