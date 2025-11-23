const ProductService = require("../services/product.service");

const ProductController = {
  getAll: async (req, res) => {
    try {
      const data = await ProductService.getAllProduct();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getProductByCategoryType: async (req, res) => {
    try {
      const categoryType = req.params.key.toUpperCase();
      const data = await ProductService.getProductByCategoryType(categoryType);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getProductByCategoryId: async (req, res) => {
    try {
      const categoryId = req.params.id.toUpperCase();
      const data = await ProductService.getProductByCategoryId(categoryId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getProductById: async (req, res) => {
    try {
      const id = req.params.id.toUpperCase();
      const data = await ProductService.getProductById(id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getProductImages: async (req, res) => {
    try {
      const productId = req.params.id.toUpperCase();
      const data = await ProductService.getProductImages(productId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getProductVariant: async (req, res) => {
    try {
      const productId = req.params.id.toUpperCase();
      const data = await ProductService.getProductVariant(productId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getProductAddon: async (req, res) => {
    try {
      const productId = req.params.id.toUpperCase();
      const data = await ProductService.getProductAddon(productId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Lấy khuyến mãi còn hiệu lực
  getActivePromotions: async (req, res) => {
    try {
      const promos = await PromotionService.getActivePromotions();
      res.json(promos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
  /** SEARCH PRODUCT BY NAME */
  search: async (req, res) => {
    try {
      const { q } = req.query;
      if (!q)
        return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });
      const products = await ProductService.searchProductByName(q);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /** CREATE PRODUCT (FULL) */
  create: async (req, res) => {
    try {
      const productData = req.body;
      const result = await ProductService.addProduct(productData);
      res.status(201).json({ message: "Tạo sản phẩm thành công", result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  /** UPDATE PRODUCT (FULL) */
  update: async (req, res) => {
    try {
      const productId = req.params.id;
      const productData = req.body;
      await ProductService.updateProduct(productId, productData);
      res.json({ message: "Cập nhật sản phẩm thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  /** ADD EXTRA CATEGORIES TO PRODUCT */
  addCategories: async (req, res) => {
    try {
      const productId = req.params.id;
      const categories = req.body.categories;
      await ProductService.addCategoriesToProduct(productId, categories);
      res.json({ message: "Đã gán thêm danh mục" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
  getPromotionByCode: async (req, res) => {
    try {
      const code = req.params.code.toUpperCase();
      const data = await ProductService.getPromotionByCode(code);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = ProductController;
