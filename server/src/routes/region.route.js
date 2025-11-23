const express = require("express");
const RegionController = require("../controllers/region.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/allowRoles.middleware");
const router = express.Router();

router.get("/", RegionController.getAll);
router.get("/:id", RegionController.getById);
router.post("/", authMiddleware, allowRoles("admin"), RegionController.create);
router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin"),
  RegionController.update
);
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin"),
  RegionController.delete
);

module.exports = router;
