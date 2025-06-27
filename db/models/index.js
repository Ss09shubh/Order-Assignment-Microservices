const Product = require('./Product');
const Vendor = require('./Vendor');
const Order = require('./Order');
const Worker = require('./Worker');
const setupAssociations = require('./associations');

// Setup associations between models
setupAssociations();

module.exports = {
  Product,
  Vendor,
  Order,
  Worker
};