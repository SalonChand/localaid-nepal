const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const supportRequestRoutes = require('./routes/supportRequests');
const organizationRoutes = require('./routes/organizations');
const taskRoutes = require('./routes/tasks');
const eventRoutes = require('./routes/events');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
const chatRoutes = require('./routes/chat');

// Initialize the Express application
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Parse incoming JSON payloads
app.use(morgan('dev')); // Log HTTP requests

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'LocalAid API is running smoothly.',
    timestamp: new Date().toISOString()
  });
});

// --- Application Routes ---
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Mount the routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support-requests', supportRequestRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);



// Export the app for the server to use
module.exports = app;