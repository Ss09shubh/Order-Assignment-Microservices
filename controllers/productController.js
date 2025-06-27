const { ProductRepository } = require('../db/repositories');

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const products = await ProductRepository.getAll();
      res.json(products);
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Failed to get products' });
    }
  }

  static async getProduct(req, res) {
    try {
      const { productId } = req.params;
      const product = await ProductRepository.findById(productId);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Failed to get product' });
    }
  }

  static async createProduct(req, res) {
    try {
      const { product_id, name, vendor_id, stock_quantity, price } = req.body;
      
      if (!product_id || !name || !vendor_id || stock_quantity < 0 || !price) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required_fields: {
            product_id: "Unique product identifier (e.g., 'PROD001', 'SKU12345')",
            name: "Product name",
            vendor_id: "Vendor identifier (e.g., 'vendor_a')",
            stock_quantity: "Initial stock quantity (≥ 0)",
            price: "Product price (> 0)"
          },
          example: {
            product_id: "PROD123",
            name: "Wireless Mouse",
            vendor_id: "vendor_b",
            stock_quantity: 50,
            price: 29.99
          }
        });
      }

      const product = await ProductRepository.create({
        product_id,
        name,
        vendor_id,
        stock_quantity,
        price
      });

      res.status(201).json({
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  static async updateProduct(req, res) {
    try {
      const { productId } = req.params;
      const { name, stock_quantity, price } = req.body;

      const product = await ProductRepository.update(productId, {
        name,
        stock_quantity,
        price
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({
        message: 'Product updated successfully',
        product
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { productId } = req.params;
      const deleted = await ProductRepository.delete(productId);

      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
}

module.exports = ProductController;