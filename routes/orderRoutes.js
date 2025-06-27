const express = require('express');
const OrderController = require('../controllers/orderController');

const router = express.Router();

router.get('/orders', OrderController.getAllOrders);
router.post('/order', OrderController.placeOrder);
router.get('/order/:orderId', OrderController.getOrderStatus);

module.exports = router;