const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
require("dotenv").config();

const db = require("../config/database.config");
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMTI1NjM3MSwiaWF0IjoxNzAxMjU2MzcxfQ.TrBKsx9Dhwy-dcaji2iBPjBhFusq1LvZp8hjfYSs0vQ";

const UserService = {
  getAllUser: async () => {
    const data = await db.query(`
            select id,
                name,
                email,
                phone,
                password_hash,
                role,
                status
            from users`);
    return data;
  },
  // Đăng ký
  register: async (data) => {
    // Validate dữ liệu đầu vào
    const schema = Joi.object({
      name: Joi.string().min(3).max(100).required(),
      email: Joi.string().email().required(),
      phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(data);
    if (error) {
      return { success: false, message: error.details[0].message };
    }

    const { name, email, phone, password } = data;

    // Kiểm tra email/phone đã tồn tại chưa
    const [exists] = await db.query(
      "SELECT id FROM users WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (exists.length > 0) {
      return { success: false, message: "Email hoặc số điện thoại đã tồn tại" };
    }

    // Mã hóa mật khẩu
    const password_hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)",
      [name, email, phone, password_hash]
    );

    return { success: true, message: "Đăng ký thành công" };
  },
  // Đăng nhập
  login: async (email, password) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return { success: false, message: "Email không tồn tại" };
    }

    const user = rows[0];

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return { success: false, message: "Mật khẩu không đúng" };
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" } //1d - 1 ngày, 7d - 7 ngày
    );

    return {
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  },
  // Lấy địa chỉ của từng user
  getUserAddress: async (userId) => {
    const data = await db.query(
      `
        select id, 
            address,
            region_id,
            is_default
        from user_addresses
        where user_id=?`,
      userId
    );
    return data;
  },
  getUserById: async (userId) => {
    const data = await db.query(
      `
      select id,
          name,
          email,
          phone,
          password_hash,
          role,
          status
      from users
      where id = ?`,
      userId
    );
    return data;
  },
  updateUser: async () => {
    const data = await db;
    return data;
  },
  // Cập nhật thông tin người dùng
  updateUser: async (userId, data) => {
    const fields = [];
    const values = [];

    if (data.name) {
      fields.push("name = ?");
      values.push(data.name);
    }
    if (data.email) {
      fields.push("email = ?");
      values.push(data.email);
    }
    if (data.phone) {
      fields.push("phone = ?");
      values.push(data.phone);
    }

    if (fields.length === 0) {
      return { success: false, message: "Không có dữ liệu cần cập nhật" };
    }

    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    await db.query(sql, values);
    return { success: true, message: "Cập nhật thành công" };
  },
  // Cập nhật địa chỉ
  updateUserAddress: async (addressId, data) => {
    const { address, region_id, is_default } = data;

    await db.query(
      `
      UPDATE user_addresses
      SET address = ?, region_id = ?, is_default = ?
      WHERE id = ?
      `,
      [address, region_id, !!is_default, addressId]
    );

    return { success: true, message: "Cập nhật địa chỉ thành công" };
  },
  // Thêm địa chỉ mới
  addUserAddress: async (user_id, data) => {
    const { address, region_id, is_default } = data;

    await db.query(
      `
      INSERT INTO user_addresses (user_id, address, region_id, is_default)
      VALUES (?, ?, ?, ?)
      `,
      [user_id, address, region_id, !!is_default]
    );

    return { success: true, message: "Thêm địa chỉ thành công" };
  },
  // Xoá địa chỉ
  deleteUserAddress: async (addressId) => {
    await db.query(`DELETE FROM user_addresses WHERE id = ?`, [addressId]);
    return { success: true, message: "Xoá địa chỉ thành công" };
  },
  changePassword: async (userId, oldPassword, newPassword) => {
    // 1. Lấy user từ DB
    const [[user]] = await db.query(
      "SELECT password_hash FROM users WHERE id = ?",
      [userId]
    );

    if (!user) {
      return { success: false, message: "Người dùng không tồn tại" };
    }

    // 2. So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return { success: false, message: "Mật khẩu cũ không đúng" };
    }

    // 3. Kiểm tra mật khẩu mới
    if (newPassword.length < 6) {
      return { success: false, message: "Mật khẩu mới phải ít nhất 6 ký tự" };
    }

    if (oldPassword === newPassword) {
      return { success: false, message: "Mật khẩu mới phải khác mật khẩu cũ" };
    }

    // 4. Mã hoá và cập nhật
    const newHash = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [
      newHash,
      userId,
    ]);

    return { success: true, message: "Đổi mật khẩu thành công" };
  },
};

module.exports = UserService;
