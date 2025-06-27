const { sequelize } = require('../config');
const Product = require('../models/Product');

class ProductRepository {
  static async create(productData) {
    return await Product.create(productData);
  }

  static async findById(productId) {
    return await Product.findOne({
      where: { product_id: productId }
    });
  }

  static async updateStock(productId, quantity, transaction = null) {
    const product = await Product.findOne({
      where: { 
        product_id: productId,
        stock_quantity: { [sequelize.Sequelize.Op.gte]: quantity }
      },
      transaction
    });

    if (!product) return null;

    product.stock_quantity -= quantity;
    await product.save({ transaction });
    return product;
  }

  static async update(productId, updateData) {
    const product = await Product.findOne({
      where: { product_id: productId }
    });

    if (!product) return null;

    if (updateData.name) product.name = updateData.name;
    if (updateData.stock_quantity !== undefined) product.stock_quantity = updateData.stock_quantity;
    if (updateData.price !== undefined) product.price = updateData.price;

    await product.save();
    return product;
  }

  static async delete(productId) {
    const product = await Product.findOne({
      where: { product_id: productId }
    });

    if (!product) return null;

    await product.destroy();
    return product;
  }

  static async getAll() {
    return await Product.findAll({
      order: [['product_id', 'ASC']]
    });
  }
}

module.exports = ProductRepository;