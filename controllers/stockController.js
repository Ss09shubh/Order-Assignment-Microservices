const { ProductRepository, VendorRepository } = require('../db/repositories');
const axios = require('axios');

class StockController {
  static async syncStock(req, res) {
    try {
      const { vendorId } = req.params;
      
      // Get vendor
      const vendor = await VendorRepository.findById(vendorId);
      
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
      
      // In real scenario, this would call the vendor API
      // For demo, generate mock data
      const stockData = await StockController.getMockStock(vendorId);
      
      // Update local stock
      const updatedProducts = [];
      for (const item of stockData) {
        const product = await ProductRepository.create({
          product_id: item.product_id,
          name: item.name || `Product ${item.product_id}`,
          vendor_id: vendorId,
          stock_quantity: item.stock_quantity,
          price: item.price
        });
        updatedProducts.push(product);
      }
      
      res.json({
        message: `Stock synchronized successfully for vendor ${vendorId}`,
        products: updatedProducts
      });
      
    } catch (error) {
      console.error('Stock sync error:', error);
      res.status(500).json({ error: 'Failed to sync stock' });
    }
  }

  static async syncAllStock(req, res) {
    try {
      // Get all vendors
      const vendors = await VendorRepository.getAll();
      
      const results = [];
      
      // Sync stock for each vendor
      for (const vendor of vendors) {
        try {
          const stockData = await StockController.getMockStock(vendor.vendor_id);
          
          const vendorResults = [];
          for (const item of stockData) {
            const product = await ProductRepository.create({
              product_id: item.product_id,
              name: item.name || `Product ${item.product_id}`,
              vendor_id: vendor.vendor_id,
              stock_quantity: item.stock_quantity,
              price: item.price
            });
            vendorResults.push(product);
          }
          
          results.push({
            vendor_id: vendor.vendor_id,
            success: true,
            products: vendorResults
          });
          
        } catch (error) {
          results.push({
            vendor_id: vendor.vendor_id,
            success: false,
            error: error.message
          });
        }
      }
      
      res.json({
        message: 'Stock synchronization completed',
        results
      });
      
    } catch (error) {
      console.error('Stock sync error:', error);
      res.status(500).json({ error: 'Failed to sync stock' });
    }
  }

  static async getVendorStock(req, res) {
    try {
      const { vendorId } = req.params;
      
      const products = await ProductRepository.getAll();
      const vendorProducts = products.filter(product => product.vendor_id === vendorId);
      
      res.json(vendorProducts);
      
    } catch (error) {
      console.error('Get vendor stock error:', error);
      res.status(500).json({ error: 'Failed to get vendor stock' });
    }
  }

  // Mock vendor stock data generator
  static async getMockStock(vendorId) {
    const mockData = {
      vendor_a: [
        { product_id: 'PROD001', name: 'Laptop', stock_quantity: Math.floor(Math.random() * 100), price: 999.99 },
        { product_id: 'PROD004', name: 'Monitor', stock_quantity: Math.floor(Math.random() * 50), price: 299.99 },
        { product_id: 'PROD006', name: 'Tablet', stock_quantity: Math.floor(Math.random() * 40), price: 399.99 }
      ],
      vendor_b: [
        { product_id: 'PROD002', name: 'Mouse', stock_quantity: Math.floor(Math.random() * 200), price: 29.99 },
        { product_id: 'PROD005', name: 'Headphones', stock_quantity: Math.floor(Math.random() * 80), price: 149.99 },
        { product_id: 'PROD007', name: 'Speakers', stock_quantity: Math.floor(Math.random() * 60), price: 89.99 }
      ],
      vendor_c: [
        { product_id: 'PROD003', name: 'Keyboard', stock_quantity: Math.floor(Math.random() * 150), price: 79.99 },
        { product_id: 'PROD008', name: 'Webcam', stock_quantity: Math.floor(Math.random() * 70), price: 59.99 }
      ]
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockData[vendorId] || [];
  }
}

module.exports = StockController;