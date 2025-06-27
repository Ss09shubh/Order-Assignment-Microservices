const express = require('express');
const WorkerController = require('../controllers/workerController');

const router = express.Router();

router.get('/workers', WorkerController.getAllWorkers);
router.post('/workers', WorkerController.createWorker);
router.get('/workers/:workerId', WorkerController.getWorker);
router.put('/workers/:workerId', WorkerController.updateWorker);
router.delete('/workers/:workerId', WorkerController.deleteWorker);

module.exports = router;