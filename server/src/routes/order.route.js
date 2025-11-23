const express = require("express");
const OrderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/allowRoles.middleware");
const router = express.Router();

router.get("/", authMiddleware, allowRoles("admin"), OrderController.getAll);
router.get("/user/:userId", authMiddleware, OrderController.getByUserId);
router.post("/", authMiddleware, OrderController.create);
router.put("/:id", authMiddleware, OrderController.update);

module.exports = router;
