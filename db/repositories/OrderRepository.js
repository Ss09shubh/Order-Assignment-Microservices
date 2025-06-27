const { sequelize } = require('../config');
const Order = require('../models/Order');

class OrderRepository {
  static async create(orderData, transaction = null) {
    return await Order.create(orderData, { transaction });
  }

  static async findById(orderId) {
    return await Order.findOne({
      where: { order_id: orderId }
    });
  }

  static async updateStatus(orderId, status) {
    const order = await Order.findOne({
      where: { order_id: orderId }
    });

    if (!order) return null;

    order.status = status;
    await order.save();
    return order;
  }

  static async getAll() {
    return await Order.findAll({
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = OrderRepository;