const RegionService = require("../services/region.service");

const RegionController = {
  getAll: async (req, res) => {
    try {
      const data = await RegionService.getAllRegion();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getById: async (req, res) => {
    try {
      const id = req.params.id.toUpperCase();
      const data = await RegionService.getByIdRegion(id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  create: async (req, res) => {
    try {
      const { code, name, shipping_fee, note } = req.body;

      if (!code || !name || shipping_fee == null) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newRegion = await RegionService.createRegion({
        code,
        name,
        shipping_fee,
        note,
      });

      res.status(201).json(newRegion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const { code, name, shipping_fee, note } = req.body;

      const success = await RegionService.updateRegion(id, {
        code,
        name,
        shipping_fee,
        note,
      });

      if (!success) {
        return res
          .status(404)
          .json({ message: "Region not found or update failed" });
      }

      res.json({ message: "Region updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const success = await RegionService.deleteRegion(id);

      if (!success) {
        return res
          .status(404)
          .json({ message: "Region not found or delete failed" });
      }

      res.json({ message: "Region deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
module.exports = RegionController;
