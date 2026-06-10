import { Router } from 'express';
import { carts, generateId } from '../db/store.js';
import { Cart, CartItem } from '../types/index.js';

const router = Router();

// Get cart by userId
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const cart = carts.get(userId);
  
  if (!cart) {
    return res.json({ userId, items: [], updatedAt: new Date().toISOString() });
  }
  
  res.json(cart);
});

// Add item to cart
router.post('/:userId/items', (req, res) => {
  const { userId } = req.params;
  const { productId, quantity, variantId } = req.body;
  
  if (!productId || !quantity) {
    return res.status(400).json({ error: 'productId and quantity are required' });
  }
  
  let cart = carts.get(userId);
  
  if (!cart) {
    cart = {
      userId,
      items: [],
      updatedAt: new Date().toISOString()
    };
  }
  
  const existingItemIndex = cart.items.findIndex(
    item => item.productId === productId && item.variantId === variantId
  );
  
  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, variantId });
  }
  
  cart.updatedAt = new Date().toISOString();
  carts.set(userId, cart);
  
  res.json(cart);
});

// Update cart item quantity
router.put('/:userId/items/:productId', (req, res) => {
  const { userId, productId } = req.params;
  const { quantity, variantId } = req.body;
  
  const cart = carts.get(userId);
  
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  const itemIndex = cart.items.findIndex(
    item => item.productId === productId && item.variantId === variantId
  );
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }
  
  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }
  
  cart.updatedAt = new Date().toISOString();
  carts.set(userId, cart);
  
  res.json(cart);
});

// Remove item from cart
router.delete('/:userId/items/:productId', (req, res) => {
  const { userId, productId } = req.params;
  const { variantId } = req.query;
  
  const cart = carts.get(userId);
  
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  cart.items = cart.items.filter(
    item => !(item.productId === productId && item.variantId === variantId)
  );
  
  cart.updatedAt = new Date().toISOString();
  carts.set(userId, cart);
  
  res.json(cart);
});

// Clear cart
router.delete('/:userId', (req, res) => {
  const { userId } = req.params;
  carts.delete(userId);
  res.json({ message: 'Cart cleared' });
});

export default router;
