const { OrderRepository, ProductRepository } = require('../db/repositories');
const { getChannel } = require('../config/rabbitmq');
const { sequelize } = require('../db/config');

class OrderController {
  static async placeOrder(req, res) {
    const { product_id, quantity } = req.body;
    
    if (!product_id || !quantity || quantity <= 0) {
      return res.status(400).json({ 
        error: 'Invalid product_id or quantity',
        required_fields: {
          product_id: "Product identifier (e.g., 'PROD001')",
          quantity: "Order quantity (must be > 0)"
        },
        example: {
          product_id: "PROD001",
          quantity: 2
        },
        available_products: "Use GET /api/products to get a list of available products"
      });
    }

    const transaction = await sequelize.transaction();
    
    try {
      // Check and reserve stock atomically
      const product = await ProductRepository.updateStock(product_id, quantity, transaction);
      
      if (!product) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Insufficient stock or product not found' });
      }

      const orderId = Date.now().toString();
      const orderData = {
        order_id: orderId,
        product_id,
        quantity,
        status: 'pending',
        total_price: product.price * quantity
      };

      // Create order within transaction
      const order = await OrderRepository.create(orderData, transaction);
      
      await transaction.commit();

      // Queue order for processing
      const channel = getChannel();
      if (channel) {
        await channel.sendToQueue('order_queue', Buffer.from(JSON.stringify({
          orderId,
          product_id,
          quantity,
          vendor_id: product.vendor_id
        })), { persistent: true });
      } else {
        // Process synchronously if no queue
        await OrderRepository.updateStatus(orderId, 'completed');
      }

      res.status(201).json({ 
        message: 'Order placed successfully',
        order
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Order placement error:', error);
      res.status(500).json({ error: 'Failed to place order' });
    }
  }

  static async getOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const order = await OrderRepository.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({ error: 'Failed to get order' });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = await OrderRepository.getAll();
      res.json(orders);
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Failed to get orders' });
    }
  }
}

module.exports = OrderController;