import { Router } from 'express';
import { favorites } from '../db/store.js';
import { Favorite } from '../types/index.js';

const router = Router();

// Get favorites by userId
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const userFavorites = favorites.get(userId);
  
  if (!userFavorites) {
    return res.json({ userId, productIds: [], updatedAt: new Date().toISOString() });
  }
  
  res.json(userFavorites);
});

// Add product to favorites
router.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  
  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }
  
  let userFavorites = favorites.get(userId);
  
  if (!userFavorites) {
    userFavorites = {
      userId,
      productIds: [],
      updatedAt: new Date().toISOString()
    };
  }
  
  if (!userFavorites.productIds.includes(productId)) {
    userFavorites.productIds.push(productId);
    userFavorites.updatedAt = new Date().toISOString();
    favorites.set(userId, userFavorites);
  }
  
  res.json(userFavorites);
});

// Remove product from favorites
router.delete('/:userId/:productId', (req, res) => {
  const { userId, productId } = req.params;
  
  const userFavorites = favorites.get(userId);
  
  if (!userFavorites) {
    return res.status(404).json({ error: 'Favorites not found' });
  }
  
  userFavorites.productIds = userFavorites.productIds.filter(id => id !== productId);
  userFavorites.updatedAt = new Date().toISOString();
  favorites.set(userId, userFavorites);
  
  res.json(userFavorites);
});

// Clear all favorites
router.delete('/:userId', (req, res) => {
  const { userId } = req.params;
  favorites.delete(userId);
  res.json({ message: 'Favorites cleared' });
});

export default router;
