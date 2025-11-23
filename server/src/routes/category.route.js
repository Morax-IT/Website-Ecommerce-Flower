const express = require("express");
const CategoryController = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/allowRoles.middleware");
const router = express.Router();

router.get("/", CategoryController.getAll);
router.get("/type", CategoryController.getLeverOne);
router.get("/children/:key", CategoryController.getLeverTwo);
router.get("/search", CategoryController.searchCategory);

// Protected: chỉ admin được phép
router.post(
  "/",
  authMiddleware,
  allowRoles("admin"),
  CategoryController.createCategory
);
router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin"),
  CategoryController.updateCategory
);

module.exports = router;
