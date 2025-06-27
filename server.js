const express = require('express');
const cors = require('cors');
const { connectRabbitMQ } = require('./config/rabbitmq');
const { swaggerUi, swaggerDocument, swaggerOptions } = require('./config/swagger');
const { testConnection } = require('./db/config');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const workerRoutes = require('./routes/workerRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const stockRoutes = require('./routes/stockRoutes');
require('dotenv').config();

// Initialize models and associations
require('./db/models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Routes
app.use('/api', orderRoutes);
app.use('/api', productRoutes);
app.use('/api', workerRoutes);
app.use('/api', vendorRoutes);
app.use('/api', stockRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    server: 'Order Processing Platform',
    version: '1.0.0',
    connections: {
      database: 'connected',
      rabbitmq: global.rabbitmqConnected ? 'connected' : 'disconnected'
    }
  });
});

// Connection status endpoint
app.get('/status', (req, res) => {
  res.json({
    server: {
      status: 'online',
      uptime: process.uptime(),
      started: new Date(Date.now() - process.uptime() * 1000).toISOString()
    },
    database: {
      status: 'connected'
    },
    rabbitmq: {
      status: global.rabbitmqConnected ? 'connected' : 'disconnected'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('Failed to connect to database. Please check your database configuration.');
      process.exit(1);
    }
    
    // Try to initialize RabbitMQ (optional)
    try {
      await connectRabbitMQ();
      global.rabbitmqConnected = true;
      //console.log('RabbitMQ connected - Full functionality enabled');
    } catch (error) {
      global.rabbitmqConnected = false;
      console.log('RabbitMQ not available - Orders will process synchronously');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
    
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

startServer(); 