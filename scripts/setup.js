const { sequelize } = require('../db/config');
const Vendor = require('../db/models/Vendor');
const Product = require('../db/models/Product');
const Worker = require('../db/models/Worker');

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('Database tables created');
    
    // Insert sample vendors
    const sampleVendors = [
      { vendor_id: 'vendor_a', name: 'Tech Solutions Inc', api_url: 'http://localhost:3001', status: 'active' },
      { vendor_id: 'vendor_b', name: 'Digital Hardware Co', api_url: 'http://localhost:3002', status: 'active' },
      { vendor_id: 'vendor_c', name: 'Electronics Plus', api_url: 'http://localhost:3003', status: 'active' }
    ];

    for (const vendor of sampleVendors) {
      await Vendor.create(vendor);
    }
    console.log('Sample vendors inserted');

    // Insert sample products
    const sampleProducts = [
      { product_id: 'PROD001', name: 'Laptop', vendor_id: 'vendor_a', stock_quantity: 50, price: 999.99 },
      { product_id: 'PROD002', name: 'Mouse', vendor_id: 'vendor_b', stock_quantity: 100, price: 29.99 },
      { product_id: 'PROD003', name: 'Keyboard', vendor_id: 'vendor_c', stock_quantity: 75, price: 79.99 },
      { product_id: 'PROD004', name: 'Monitor', vendor_id: 'vendor_a', stock_quantity: 30, price: 299.99 },
      { product_id: 'PROD005', name: 'Headphones', vendor_id: 'vendor_b', stock_quantity: 60, price: 149.99 }
    ];

    for (const product of sampleProducts) {
      await Product.create(product);
    }
    console.log('Sample products inserted');

    // Insert sample workers
    const sampleWorkers = [
      { worker_id: 'WORK001', name: 'John Doe', vendor_id: 'vendor_a', status: 'active' },
      { worker_id: 'WORK002', name: 'Jane Smith', vendor_id: 'vendor_b', status: 'active' },
      { worker_id: 'WORK003', name: 'Bob Johnson', vendor_id: 'vendor_c', status: 'active' },
      { worker_id: 'WORK004', name: 'Alice Brown', vendor_id: 'vendor_a', status: 'inactive' }
    ];

    for (const worker of sampleWorkers) {
      await Worker.create(worker);
    }
    console.log('Sample workers inserted');

    console.log('Database setup completed successfully!');
    console.log('Available vendor IDs: vendor_a, vendor_b, vendor_c');
    
  } catch (error) {
    console.error('Database setup error:', error);
  } finally {
    // Don't close the connection as it's managed by Sequelize
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };