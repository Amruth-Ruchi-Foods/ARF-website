console.log("SERVER FILE LOADED");

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
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://amruthruchi.com',
  'https://www.amruthruchi.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from origin: ${origin}`);
      callback(null, true); // Allow all origins in production for now
    }
  },
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
  
  const HOST = process.env.HOST || '0.0.0.0';
  console.log("ABOUT TO START EXPRESS");
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Backend server running on http://${HOST}:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: MySQL`);
  });
}

startServer();
