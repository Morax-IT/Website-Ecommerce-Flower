const express = require("express");
const UserController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/allowRoles.middleware");
const router = express.Router();

router.get("/", authMiddleware, allowRoles("admin"), UserController.getAllUser);
router.post("/login", UserController.login);
router.post("/register", UserController.register);

// Authenticated routes (user phải đăng nhập)
router.get("/profile", authMiddleware, UserController.getProfile);
router.put("/update", authMiddleware, UserController.updateUser);
router.put("/change-password", authMiddleware, UserController.changePassword);

// Address routes
router.get("/addresses", authMiddleware, UserController.getUserAddress);
router.post("/addresses", authMiddleware, UserController.addUserAddress);
router.put("/addresses/:id", authMiddleware, UserController.updateUserAddress);
router.delete(
  "/addresses/:id",
  authMiddleware,
  UserController.deleteUserAddress
);

module.exports = router;
