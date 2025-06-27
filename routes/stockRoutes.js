const express = require('express');
const StockController = require('../controllers/stockController');

const router = express.Router();

router.get('/stock/sync', StockController.syncAllStock);
router.get('/stock/sync/:vendorId', StockController.syncStock);
router.get('/stock/:vendorId', StockController.getVendorStock);

module.exports = router;