const express = require("express");
const ProductController = require("../controllers/product.controller");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/allowRoles.middleware");

router.get("/", ProductController.getAll);
router.get("/category-type/:key", ProductController.getProductByCategoryType);
router.get("/category-id/:id", ProductController.getProductByCategoryId);
router.get("/product-id/:id", ProductController.getProductById);
router.get("/product-image/:id", ProductController.getProductImages);
router.get("/product-variant/:id", ProductController.getProductVariant);
router.get("/product-addon/:id", ProductController.getProductAddon);
router.get("/search", ProductController.search);
router.get("/promotions", ProductController.getActivePromotions);
router.get("/promotion/:code", ProductController.getPromotionByCode);

// admin
router.post("/", authMiddleware, allowRoles("admin"), ProductController.create);
router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin"),
  ProductController.update
);
router.patch(
  "/:id/categories",
  authMiddleware,
  allowRoles("admin"),
  ProductController.addCategories
);

module.exports = router;
