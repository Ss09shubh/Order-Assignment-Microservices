const { WorkerRepository } = require('../db/repositories');

class WorkerController {
  static async getAllWorkers(req, res) {
    try {
      const workers = await WorkerRepository.getAll();
      res.json(workers);
    } catch (error) {
      console.error('Get workers error:', error);
      res.status(500).json({ error: 'Failed to get workers' });
    }
  }

  static async getWorker(req, res) {
    try {
      const { workerId } = req.params;
      const worker = await WorkerRepository.findById(workerId);
      
      if (!worker) {
        return res.status(404).json({ error: 'Worker not found' });
      }

      res.json(worker);
    } catch (error) {
      console.error('Get worker error:', error);
      res.status(500).json({ error: 'Failed to get worker' });
    }
  }

  static async createWorker(req, res) {
    try {
      const { worker_id, name, vendor_id, status } = req.body;
      
      if (!worker_id || !name || !vendor_id) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required_fields: {
            worker_id: "Unique worker identifier (e.g., 'WORK001', 'EMP123')",
            name: "Worker name",
            vendor_id: "Vendor identifier (e.g., 'vendor_a')"
          },
          optional_fields: {
            status: "Worker status ('active', 'inactive', or 'busy')"
          },
          example: {
            worker_id: "WORK005",
            name: "Sarah Johnson",
            vendor_id: "vendor_b",
            status: "active"
          },
          available_vendors: "Use GET /api/vendors to get a list of available vendor IDs"
        });
      }

      const worker = await WorkerRepository.create({
        worker_id,
        name,
        vendor_id,
        status: status || 'active'
      });

      res.status(201).json({
        message: 'Worker created successfully',
        worker
      });
    } catch (error) {
      console.error('Create worker error:', error);
      res.status(500).json({ error: 'Failed to create worker' });
    }
  }

  static async updateWorker(req, res) {
    try {
      const { workerId } = req.params;
      const { name, status, vendor_id } = req.body;

      const worker = await WorkerRepository.update(workerId, {
        name,
        status,
        vendor_id
      });

      if (!worker) {
        return res.status(404).json({ error: 'Worker not found' });
      }

      res.json({
        message: 'Worker updated successfully',
        worker
      });
    } catch (error) {
      console.error('Update worker error:', error);
      res.status(500).json({ error: 'Failed to update worker' });
    }
  }

  static async deleteWorker(req, res) {
    try {
      const { workerId } = req.params;
      const deleted = await WorkerRepository.delete(workerId);

      if (!deleted) {
        return res.status(404).json({ error: 'Worker not found' });
      }

      res.json({ message: 'Worker deleted successfully' });
    } catch (error) {
      console.error('Delete worker error:', error);
      res.status(500).json({ error: 'Failed to delete worker' });
    }
  }

  static async getWorkersByVendor(req, res) {
    try {
      const { vendorId } = req.params;
      const workers = await WorkerRepository.getByVendor(vendorId);
      res.json(workers);
    } catch (error) {
      console.error('Get workers by vendor error:', error);
      res.status(500).json({ error: 'Failed to get workers' });
    }
  }
}

module.exports = WorkerController;