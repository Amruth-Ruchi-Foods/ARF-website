# ARF Backend API

Backend API for Amruth Ruchi Foods e-commerce platform.

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

## Development

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/items` - Add item to cart
- `PUT /api/cart/:userId/items/:productId` - Update item quantity
- `DELETE /api/cart/:userId/items/:productId` - Remove item from cart
- `DELETE /api/cart/:userId` - Clear cart

### Favorites
- `GET /api/favorites/:userId` - Get user's favorites
- `POST /api/favorites/:userId` - Add product to favorites
- `DELETE /api/favorites/:userId/:productId` - Remove from favorites
- `DELETE /api/favorites/:userId` - Clear all favorites

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:orderId` - Get order by ID
- `GET /api/orders/user/:userEmail` - Get user's orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:orderId/status` - Update order status
- `POST /api/orders/:orderId/cancel` - Cancel order

## Production

```bash
npm run build
npm start
```
