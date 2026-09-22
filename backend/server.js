import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './src/config/db.js';
import { seedProductsIfEmpty } from './src/seeds/seedProducts.js';

import authRoutes from './src/routes/authRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import mealRoutes from './src/routes/mealRoutes.js';
import lifestyleRoutes from './src/routes/lifestyleRoutes.js';
import reminderRoutes from './src/routes/reminderRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import storeRoutes from './src/routes/storeRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import foodRoutes from './src/routes/foodRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('dev'));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/lifestyle', lifestyleRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/food', foodRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'VitaCare AI-Powered Preventive Healthcare, Nutrition & Lifestyle Wellness Platform',
    timestamp: new Date().toISOString(),
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  await seedProductsIfEmpty();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🌿 VitaCare Backend Server running on port ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
};

startServer().catch(err => {
  console.error('Failed to start VitaCare backend server:', err);
});
