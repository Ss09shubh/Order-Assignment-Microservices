const express = require('express');
const ProductController = require('../controllers/productController');

const router = express.Router();

router.get('/products', ProductController.getAllProducts);
router.post('/products', ProductController.createProduct);
router.get('/products/:productId', ProductController.getProduct);
router.put('/products/:productId', ProductController.updateProduct);
router.delete('/products/:productId', ProductController.deleteProduct);

module.exports = router;