import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './db/connection.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart-mysql.js';
import favoritesRoutes from './routes/favorites-mysql.js';
import ordersRoutes from './routes/orders-mysql.js';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'ARF Backend API',
    version: '1.0.0',
    database: 'MySQL',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      cart: '/api/cart/:userId',
      favorites: '/api/favorites/:userId',
      orders: '/api/orders',
      payment: '/api/payment'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/health', async (req, res) => {
  const dbHealthy = await testConnection();
  res.json({ 
    status: dbHealthy ? 'ok' : 'degraded',
    database: dbHealthy ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString() 
  });
});

// Start server
async function startServer() {
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('⚠️  Database connection failed. Please check your MySQL configuration.');
    console.error('⚠️  Server will start but database operations will fail.');
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: MySQL`);
  });
}

startServer();
