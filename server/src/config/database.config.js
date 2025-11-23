const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "mysql",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "gift_selling",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;

// (tùy chọn) test kết nối khi khởi động
async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ Kết nối MySQL thành công:", rows);
  } catch (err) {
    console.error("❌ Lỗi kết nối MySQL:", err);
  }
}
testConnection();
