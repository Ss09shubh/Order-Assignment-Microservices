const Vendor = require('../models/Vendor');

class VendorRepository {
  static async create(vendorData) {
    return await Vendor.create(vendorData);
  }

  static async findById(vendorId) {
    return await Vendor.findOne({
      where: { vendor_id: vendorId }
    });
  }

  static async update(vendorId, updateData) {
    const vendor = await Vendor.findOne({
      where: { vendor_id: vendorId }
    });

    if (!vendor) return null;

    if (updateData.name) vendor.name = updateData.name;
    if (updateData.api_url) vendor.api_url = updateData.api_url;
    if (updateData.status) vendor.status = updateData.status;

    await vendor.save();
    return vendor;
  }

  static async delete(vendorId) {
    const vendor = await Vendor.findOne({
      where: { vendor_id: vendorId }
    });

    if (!vendor) return null;

    await vendor.destroy();
    return vendor;
  }

  static async getAll() {
    return await Vendor.findAll();
  }
}

module.exports = VendorRepository;