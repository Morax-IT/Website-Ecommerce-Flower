const UserService = require("../services/user.service");

const UserController = {
  // Lấy danh sách user
  getAllUser: async (req, res) => {
    try {
      const users = await UserService.getAllUser();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Đăng ký
  register: async (req, res) => {
    try {
      const result = await UserService.register(req.body);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      if (!result.success) {
        return res.status(401).json(result);
      }
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
  //Profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const [[user]] = await UserService.getUserById(userId);
      if (!user)
        return res.status(404).json({ message: "Không tìm thấy người dùng" });

      delete user.password_hash;
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server" });
    }
  },
  // Cập nhật thông tin user
  updateUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await UserService.updateUser(userId, req.body);
      if (!result.success) return res.status(400).json(result);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  //ChangePassword
  changePassword: async (req, res) => {
    try {
      const userId = req.user.id; // nếu dùng JWT middleware
      const { oldPassword, newPassword } = req.body;

      const result = await UserService.changePassword(
        userId,
        oldPassword,
        newPassword
      );
      if (!result.success) return res.status(400).json(result);

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Lấy danh sách địa chỉ của user
  getUserAddress: async (req, res) => {
    try {
      const userId = req.user.id;
      const [addresses] = await UserService.getUserAddress(userId);
      res.json(addresses);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Thêm địa chỉ mới
  addUserAddress: async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await UserService.addUserAddress(userId, req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Cập nhật địa chỉ
  updateUserAddress: async (req, res) => {
    try {
      const addressId = req.params.id;
      const result = await UserService.updateUserAddress(addressId, req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Xoá địa chỉ
  deleteUserAddress: async (req, res) => {
    try {
      const addressId = req.params.id;
      const result = await UserService.deleteUserAddress(addressId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server" });
    }
  },
};

module.exports = UserController;
