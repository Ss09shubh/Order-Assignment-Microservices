const Product = require('./Product');
const Vendor = require('./Vendor');
const Order = require('./Order');
const Worker = require('./Worker');

// Define relationships
const setupAssociations = () => {
  // Product belongs to Vendor
  Product.belongsTo(Vendor, { foreignKey: 'vendor_id', targetKey: 'vendor_id' });
  Vendor.hasMany(Product, { foreignKey: 'vendor_id', sourceKey: 'vendor_id' });

  // Order belongs to Product
  Order.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'product_id' });
  Product.hasMany(Order, { foreignKey: 'product_id', sourceKey: 'product_id' });

  // Worker belongs to Vendor
  Worker.belongsTo(Vendor, { foreignKey: 'vendor_id', targetKey: 'vendor_id' });
  Vendor.hasMany(Worker, { foreignKey: 'vendor_id', sourceKey: 'vendor_id' });
};

module.exports = setupAssociations;