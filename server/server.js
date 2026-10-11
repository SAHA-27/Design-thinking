const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, isDbConnected } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend dev server and direct testing
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const aiRoutes = require('./routes/aiRoutes');
const passportRoutes = require('./routes/passportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const proofCareRoutes = require('./routes/proofCareRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/passport', passportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/proofcare', proofCareRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ServEase AI API',
    database: isDbConnected() ? 'MongoDB Atlas / Connected' : 'Resilient In-Memory Hybrid Store',
    timestamp: new Date().toISOString()
  });
});

// Seed data route for quick web-triggered resets
app.post('/api/seed', async (req, res) => {
  try {
    const seed = require('./seed/seedData');
    const { getStore } = require('./services/dataStore');
    const { isDb, User, TechnicianProfile, ServiceCategory, Service, Booking, RegisteredAsset, Review, Notification } = getStore();

    if (isDb) {
      await seed.seedAll(User, TechnicianProfile, ServiceCategory, Service, Booking, RegisteredAsset, Review, Notification);
    }
    res.json({ success: true, message: 'Database refreshed with seed data!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('ServEase AI Backend Server is running. Access API endpoints at /api/...');
});

// Start Server and Database
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 ServEase AI Server running on port ${PORT}`);
    console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
  });
};

startServer();
