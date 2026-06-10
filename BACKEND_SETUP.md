# Backend API Setup Guide

## Quick Start

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` if needed:
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Start Backend Server
```bash
npm run dev
```

Server will run on `http://localhost:3001`

### 4. Configure Frontend
In the root directory, create `.env`:
```bash
cp .env.example .env
```

Content:
```
VITE_API_URL=http://localhost:3001
```

### 5. Start Frontend
```bash
npm run dev
```

## Features

✅ **Authentication System**
- Login/Signup with email & password
- Session management with localStorage
- Profile management

✅ **Cart Management**
- Add/remove items
- Update quantities
- Variant support
- Persisted to backend

✅ **Favorites**
- Add/remove products from favorites
- Synced across sessions

✅ **Order Management**
- Create orders with delivery details
- Track order status
- View order history
- Admin panel for order management

✅ **Order History**
- View all orders by user email
- Track delivery progress
- Rate delivered products

## API Endpoints

### Cart
- `GET /api/cart/:userId` - Get cart
- `POST /api/cart/:userId/items` - Add item
- `PUT /api/cart/:userId/items/:productId` - Update quantity
- `DELETE /api/cart/:userId/items/:productId` - Remove item

### Favorites
- `GET /api/favorites/:userId` - Get favorites
- `POST /api/favorites/:userId` - Add favorite
- `DELETE /api/favorites/:userId/:productId` - Remove favorite

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:orderId` - Get order
- `GET /api/orders/user/:userEmail` - Get user orders
- `PATCH /api/orders/:orderId/status` - Update status
- `GET /api/orders` - Get all orders (admin)

## Admin Panel

Access at `/admin` with password: `arf2024`

Features:
- View all orders
- Update order status
- Bulk status updates
- Order search & filtering
- Customer details

## Database Migration

Currently using in-memory storage. To add a database:

1. Install database driver (e.g., `npm install mongodb` or `npm install pg`)
2. Update `backend/src/db/store.ts` to use database instead of Map
3. Add database connection in `backend/src/server.ts`

Example for MongoDB:
```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('arf');

export const ordersCollection = db.collection('orders');
export const cartsCollection = db.collection('carts');
export const favoritesCollection = db.collection('favorites');
```

## Testing

Test the API:
```bash
# Health check
curl http://localhost:3001/health

# Get cart
curl http://localhost:3001/api/cart/user123

# Create order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[...],"delivery":{...},"paymentMethod":"cod","totalPrice":500}'
```

## Production Deployment

1. Build backend:
```bash
cd backend
npm run build
```

2. Set production environment variables
3. Start with `npm start`
4. Use a process manager like PM2:
```bash
pm2 start dist/server.js --name arf-backend
```

## Troubleshooting

**CORS errors**: Check `FRONTEND_URL` in backend `.env`

**Connection refused**: Ensure backend is running on port 3001

**Orders not persisting**: In-memory storage resets on server restart. Add a database for persistence.
