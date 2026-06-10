import { Router } from 'express';
import { pool } from '../db/connection.js';

const router = Router();

// Get favorites by userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [items] = await pool.query(
      'SELECT product_id as productId FROM favorites WHERE user_id = ?',
      [userId]
    );
    
    const productIds = (items as any[]).map(item => item.productId);
    
    res.json({
      userId,
      productIds,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

// Add product to favorites
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    
    // Insert (ignore if already exists)
    await pool.query(
      'INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );
    
    // Return updated favorites
    const [items] = await pool.query(
      'SELECT product_id as productId FROM favorites WHERE user_id = ?',
      [userId]
    );
    
    const productIds = (items as any[]).map(item => item.productId);
    
    res.json({
      userId,
      productIds,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove product from favorites
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    await pool.query(
      'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    
    // Return updated favorites
    const [items] = await pool.query(
      'SELECT product_id as productId FROM favorites WHERE user_id = ?',
      [userId]
    );
    
    const productIds = (items as any[]).map(item => item.productId);
    
    res.json({
      userId,
      productIds,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Clear all favorites
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query('DELETE FROM favorites WHERE user_id = ?', [userId]);
    res.json({ message: 'Favorites cleared' });
  } catch (error) {
    console.error('Clear favorites error:', error);
    res.status(500).json({ error: 'Failed to clear favorites' });
  }
});

export default router;
