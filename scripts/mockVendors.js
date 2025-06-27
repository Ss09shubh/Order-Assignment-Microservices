const express = require('express');

function createMockVendor(port, vendorId) {
  const app = express();
  app.use(express.json());

  const stockData = {
    vendor_a: {
      'PROD001': { stock: 50, price: 999.99 },
      'PROD004': { stock: 30, price: 299.99 }
    },
    vendor_b: {
      'PROD002': { stock: 100, price: 29.99 },
      'PROD005': { stock: 60, price: 149.99 }
    },
    vendor_c: {
      'PROD003': { stock: 75, price: 79.99 }
    }
  };

  app.get('/stock', (req, res) => {
    const products = Object.entries(stockData[vendorId] || {}).map(([product_id, data]) => ({
      product_id,
      stock_quantity: data.stock,
      price: data.price
    }));
    res.json(products);
  });

  app.post('/update-stock', (req, res) => {
    const { product_id, quantity } = req.body;
    if (stockData[vendorId] && stockData[vendorId][product_id]) {
      stockData[vendorId][product_id].stock += quantity;
      console.log(`${vendorId} - Updated ${product_id} stock: ${stockData[vendorId][product_id].stock}`);
      res.json({ success: true, new_stock: stockData[vendorId][product_id].stock });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  app.listen(port, () => {
    console.log(`Mock ${vendorId} running on port ${port}`);
  });
}

// Start mock vendors
createMockVendor(3001, 'vendor_a');
createMockVendor(3002, 'vendor_b');
createMockVendor(3003, 'vendor_c');