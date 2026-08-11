const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

const vehicleRoutes = require('./routes/vehicleRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middleware/errorHandler');
const { securityHeaders } = require('./middleware/securityMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Security Headers Middleware
app.use(securityHeaders);

// Environment-aware CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV === 'production') {
        return callback(new Error('CORS Policy Violation: Access denied for this origin'), false);
      }
      return callback(null, true); // Permissive in non-production dev mode
    },
    credentials: true
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve static uploaded files locally (fallback)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Production-ready API Health check route
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    success: isHealthy,
    message: 'AutoCompare Backend API is running smoothly',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found - ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  AutoCompare Backend REST API Server running on port ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`  Vehicles API: http://localhost:${PORT}/api/vehicles`);
    console.log(`  Admin Auth:   http://localhost:${PORT}/api/admin/auth/login`);
    console.log(`  Admin API:    http://localhost:${PORT}/api/admin/vehicles`);
    console.log(`  AI Advisor:   http://localhost:${PORT}/api/ai/chat`);
    console.log(`=======================================================`);
  });
});
