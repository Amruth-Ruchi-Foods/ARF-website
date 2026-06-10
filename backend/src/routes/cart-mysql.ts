import { Router } from 'express';
import { pool } from '../db/connection.js';

const router = Router();

// Get cart by userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [items] = await pool.query(
      'SELECT product_id as productId, quantity, variant_id as variantId FROM carts WHERE user_id = ?',
      [userId]
    );
    
    res.json({
      userId,
      items,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

// Add item to cart
router.post('/:userId/items', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity, variantId } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'productId and quantity are required' });
    }
    
    // Check if item exists
    const [existing] = await pool.query(
      'SELECT id, quantity FROM carts WHERE user_id = ? AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))',
      [userId, productId, variantId || null, variantId || null]
    );
    
    if ((existing as any[]).length > 0) {
      // Update quantity
      const newQuantity = (existing as any[])[0].quantity + quantity;
      await pool.query(
        'UPDATE carts SET quantity = ? WHERE id = ?',
        [newQuantity, (existing as any[])[0].id]
      );
    } else {
      // Insert new item
      await pool.query(
        'INSERT INTO carts (user_id, product_id, quantity, variant_id) VALUES (?, ?, ?, ?)',
        [userId, productId, quantity, variantId || null]
      );
    }
    
    // Return updated cart
    const [items] = await pool.query(
      'SELECT product_id as productId, quantity, variant_id as variantId FROM carts WHERE user_id = ?',
      [userId]
    );
    
    res.json({
      userId,
      items,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/:userId/items/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity, variantId } = req.body;
    
    if (quantity <= 0) {
      // Remove item
      await pool.query(
        'DELETE FROM carts WHERE user_id = ? AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))',
        [userId, productId, variantId || null, variantId || null]
      );
    } else {
      // Update quantity
      await pool.query(
        'UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))',
        [quantity, userId, productId, variantId || null, variantId || null]
      );
    }
    
    // Return updated cart
    const [items] = await pool.query(
      'SELECT product_id as productId, quantity, variant_id as variantId FROM carts WHERE user_id = ?',
      [userId]
    );
    
    res.json({
      userId,
      items,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/:userId/items/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { variantId } = req.query;
    
    await pool.query(
      'DELETE FROM carts WHERE user_id = ? AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))',
      [userId, productId, variantId || null, variantId || null]
    );
    
    // Return updated cart
    const [items] = await pool.query(
      'SELECT product_id as productId, quantity, variant_id as variantId FROM carts WHERE user_id = ?',
      [userId]
    );
    
    res.json({
      userId,
      items,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query('DELETE FROM carts WHERE user_id = ?', [userId]);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
