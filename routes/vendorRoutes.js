const express = require('express');
const VendorController = require('../controllers/vendorController');
const WorkerController = require('../controllers/workerController');

const router = express.Router();

router.get('/vendors', VendorController.getAllVendors);
router.post('/vendors', VendorController.createVendor);
router.get('/vendors/:vendorId', VendorController.getVendor);
router.put('/vendors/:vendorId', VendorController.updateVendor);
router.delete('/vendors/:vendorId', VendorController.deleteVendor);
router.get('/vendors/:vendorId/workers', WorkerController.getWorkersByVendor);

module.exports = router;