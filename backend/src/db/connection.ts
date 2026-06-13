import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool | null = null;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'amruthruchi',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });
  console.log('📦 MySQL pool created');
} catch (error) {
  console.error('⚠️  Failed to create MySQL pool:', error);
}

export { pool };

export function getPool() {
  if (!pool) {
    throw new Error('Database not configured. Please set up MySQL database.');
  }
  return pool;
}

export async function testConnection() {
  if (!pool) {
    console.error('❌ MySQL pool not initialized');
    return false;
  }
  
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    return false;
  }
}
