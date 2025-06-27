const { VendorRepository } = require('../db/repositories');

class VendorController {
  static async getAllVendors(req, res) {
    try {
      const vendors = await VendorRepository.getAll();
      res.json(vendors);
    } catch (error) {
      console.error('Get vendors error:', error);
      res.status(500).json({ error: 'Failed to get vendors' });
    }
  }

  static async getVendor(req, res) {
    try {
      const { vendorId } = req.params;
      const vendor = await VendorRepository.findById(vendorId);
      
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }

      res.json(vendor);
    } catch (error) {
      console.error('Get vendor error:', error);
      res.status(500).json({ error: 'Failed to get vendor' });
    }
  }

  static async createVendor(req, res) {
    try {
      const { vendor_id, name, api_url, status } = req.body;
      
      if (!vendor_id || !name) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required_fields: {
            vendor_id: "Unique vendor identifier (e.g., 'vendor_a', 'vendor_xyz')",
            name: "Vendor name"
          },
          optional_fields: {
            api_url: "Vendor API URL",
            status: "Vendor status ('active' or 'inactive')"
          },
          example: {
            vendor_id: "vendor_d",
            name: "Digital Supplies Co",
            api_url: "http://localhost:3004",
            status: "active"
          }
        });
      }

      const vendor = await VendorRepository.create({
        vendor_id,
        name,
        api_url,
        status: status || 'active'
      });

      res.status(201).json({
        message: 'Vendor created successfully',
        vendor
      });
    } catch (error) {
      console.error('Create vendor error:', error);
      res.status(500).json({ error: 'Failed to create vendor' });
    }
  }

  static async updateVendor(req, res) {
    try {
      const { vendorId } = req.params;
      const { name, api_url, status } = req.body;

      const vendor = await VendorRepository.update(vendorId, {
        name,
        api_url,
        status
      });

      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }

      res.json({
        message: 'Vendor updated successfully',
        vendor
      });
    } catch (error) {
      console.error('Update vendor error:', error);
      res.status(500).json({ error: 'Failed to update vendor' });
    }
  }

  static async deleteVendor(req, res) {
    try {
      const { vendorId } = req.params;
      const deleted = await VendorRepository.delete(vendorId);

      if (!deleted) {
        return res.status(404).json({ error: 'Vendor not found' });
      }

      res.json({ message: 'Vendor deleted successfully' });
    } catch (error) {
      console.error('Delete vendor error:', error);
      res.status(500).json({ error: 'Failed to delete vendor' });
    }
  }
}

module.exports = VendorController;