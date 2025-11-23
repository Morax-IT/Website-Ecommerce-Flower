const CategoryService = require("../services/category.service");
const PARENT_ID = require("../enum/category");

const CategoryController = {
  getAll: async (req, res) => {
    try {
      const data = await CategoryService.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getLeverOne: async (req, res) => {
    try {
      const data = await CategoryService.getCategoryLeverOne();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Lấy danh mục con theo parent_id người dùng chọn
  getLeverTwo: async (req, res) => {
    try {
      // Lấy key từ URL (OCCASION | TYPE | ADDON)
      const key = req.params.key.toUpperCase();

      // Map key sang id từ enum
      const parentId = PARENT_ID[key];

      // Nếu key không hợp lệ
      if (!parentId) {
        return res.status(400).json({ error: "Invalid parent key" });
      }

      const data = await CategoryService.getCategoryLeverTwo(parentId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Thêm danh mục
  createCategory: async (req, res) => {
    try {
      const { name, category_type, description, parent_id } = req.body;

      if (!name || !category_type) {
        return res
          .status(400)
          .json({ error: "Tên và loại danh mục là bắt buộc" });
      }

      const result = await CategoryService.createCategory({
        name,
        category_type,
        description,
        parent_id,
      });

      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Cập nhật danh mục
  updateCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, category_type, description, parent_id } = req.body;

      const result = await CategoryService.updateCategory(id, {
        name,
        category_type,
        description,
        parent_id,
      });

      if (!result.success) return res.status(400).json(result);

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  searchCategory: async (req, res) => {
    try {
      const { type, name } = req.query;
      const data = await CategoryService.searchByTypeAndName(type, name);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = CategoryController;
