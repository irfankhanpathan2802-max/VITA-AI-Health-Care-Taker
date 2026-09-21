import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    // Support demo mode token
    if (token === 'demo-token') {
      let demoUser = await User.findOne({ email: 'demo@vitacare.ai' });
      if (!demoUser) {
        demoUser = await User.create({
          fullName: 'Rahul Sharma',
          email: 'demo@vitacare.ai',
          mobileNumber: '+91 98765 43210',
          password: 'demo_password_hash',
          role: 'user',
          isOnboarded: true,
          isDemoUser: true,
        });
      }
      req.user = demoUser;
      return next();
    }

    const secret = process.env.JWT_SECRET || 'vitacare_super_secret_jwt_key_2026_production';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found. Please log in again.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid token. Please log in again.' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
};
