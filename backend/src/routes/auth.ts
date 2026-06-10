import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/connection.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Phone must be a valid 10-digit number' });
    }

    // Check if user exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if ((existing as any[]).length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
      [name, email, phone, passwordHash]
    );

    const userId = (result as any).insertId;

    // Generate JWT
    const token = jwt.sign(
      { id: userId, email, name },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: { id: userId, name, email, phone }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const [users] = await pool.query(
      'SELECT id, name, email, phone, password_hash FROM users WHERE email = ?',
      [email]
    );

    const user = (users as any[])[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, phone FROM users WHERE id = ?',
      [req.user!.id]
    );

    const user = (users as any[])[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Phone must be a valid 10-digit number' });
    }

    // Get current user
    const [users] = await pool.query(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user!.id]
    );

    const user = (users as any[])[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update user
    let query = 'UPDATE users SET name = ?, phone = ?';
    const params: any[] = [name, phone];

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }
      const newHash = await bcrypt.hash(newPassword, 10);
      query += ', password_hash = ?';
      params.push(newHash);
    }

    query += ' WHERE id = ?';
    params.push(req.user!.id);

    await pool.query(query, params);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
