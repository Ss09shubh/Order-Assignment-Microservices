const axios = require('axios');
const Product = require('../models/Product');
require('dotenv').config();

const vendors = [
  { id: 'vendor_a', url: process.env.VENDOR_A_URL },
  { id: 'vendor_b', url: process.env.VENDOR_B_URL },
  { id: 'vendor_c', url: process.env.VENDOR_C_URL }
];

// Mock vendor data generator
function generateMockStock(vendorId) {
  const products = {
    vendor_a: [
      { product_id: 'PROD001', name: 'Laptop', stock_quantity: Math.floor(Math.random() * 100), price: 999.99 },
      { product_id: 'PROD004', name: 'Monitor', stock_quantity: Math.floor(Math.random() * 50), price: 299.99 }
    ],
    vendor_b: [
      { product_id: 'PROD002', name: 'Mouse', stock_quantity: Math.floor(Math.random() * 200), price: 29.99 },
      { product_id: 'PROD005', name: 'Headphones', stock_quantity: Math.floor(Math.random() * 80), price: 149.99 }
    ],
    vendor_c: [
      { product_id: 'PROD003', name: 'Keyboard', stock_quantity: Math.floor(Math.random() * 150), price: 79.99 }
    ]
  };
  
  return products[vendorId] || [];
}

async function syncVendorStock(vendor) {
  try {
    console.log(`Syncing stock from ${vendor.id}...`);
    
    // In real scenario, this would be an API call
    // const response = await axios.get(`${vendor.url}/stock`);
    // const stockData = response.data;
    
    // For demo, using mock data
    const stockData = generateMockStock(vendor.id);
    
    for (const item of stockData) {
      await Product.create({
        product_id: item.product_id,
        name: item.name,
        vendor_id: vendor.id,
        stock_quantity: item.stock_quantity,
        price: item.price
      });
      
      console.log(`Updated ${item.product_id}: ${item.stock_quantity} units`);
    }
    
    console.log(`Stock sync completed for ${vendor.id}`);
    
  } catch (error) {
    console.error(`Stock sync failed for ${vendor.id}:`, error.message);
  }
}

async function syncAllVendors() {
  console.log('Starting stock synchronization...');
  
  for (const vendor of vendors) {
    await syncVendorStock(vendor);
  }
  
  console.log('Stock synchronization completed for all vendors');
}

if (require.main === module) {
  syncAllVendors().then(() => process.exit(0));
}

module.exports = { syncAllVendors, syncVendorStock };