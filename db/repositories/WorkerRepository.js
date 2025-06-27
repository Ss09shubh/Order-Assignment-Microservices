const Worker = require('../models/Worker');

class WorkerRepository {
  static async create(workerData) {
    return await Worker.create(workerData);
  }

  static async findById(workerId) {
    return await Worker.findOne({
      where: { worker_id: workerId }
    });
  }

  static async update(workerId, updateData) {
    const worker = await Worker.findOne({
      where: { worker_id: workerId }
    });

    if (!worker) return null;

    if (updateData.name) worker.name = updateData.name;
    if (updateData.status) worker.status = updateData.status;
    if (updateData.vendor_id) worker.vendor_id = updateData.vendor_id;

    await worker.save();
    return worker;
  }

  static async delete(workerId) {
    const worker = await Worker.findOne({
      where: { worker_id: workerId }
    });

    if (!worker) return null;

    await worker.destroy();
    return worker;
  }

  static async getAll() {
    return await Worker.findAll({
      order: [['created_at', 'DESC']]
    });
  }

  static async getByVendor(vendorId) {
    return await Worker.findAll({
      where: { vendor_id: vendorId },
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = WorkerRepository;