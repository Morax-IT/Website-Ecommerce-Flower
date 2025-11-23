const db = require("../config/database.config");

const CategoryService = {
  getCategoryLeverOne: async () => {
    const [rows] = await db.query(
      `SELECT 
        id,
        name, 
        category_type, 
        description, 
        parent_id 
      FROM categories
      WHERE parent_id is null`
    );
    return rows;
  },

  getCategoryLeverTwo: async (parentId) => {
    const [rows] = await db.query(
      `SELECT 
        id,
        name, 
        category_type, 
        description, 
        parent_id 
      FROM categories
      WHERE parent_id = ?`,
      parentId
    );
    return rows;
  },
  // Thêm danh mục mới
  createCategory: async ({
    name,
    category_type,
    description,
    parent_id = null,
  }) => {
    const [result] = await db.query(
      `
      INSERT INTO categories (name, category_type, description, parent_id)
      VALUES (?, ?, ?, ?)
      `,
      [name, category_type, description, parent_id]
    );
    return {
      success: true,
      message: "Tạo danh mục thành công",
      id: result.insertId,
    };
  },

  // Cập nhật danh mục theo id
  updateCategory: async (id, data) => {
    const fields = [];
    const values = [];

    if (data.name) {
      fields.push("name = ?");
      values.push(data.name);
    }
    if (data.category_type) {
      fields.push("category_type = ?");
      values.push(data.category_type);
    }
    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }
    if (data.parent_id !== undefined) {
      fields.push("parent_id = ?");
      values.push(data.parent_id);
    }

    if (fields.length === 0) {
      return { success: false, message: "Không có trường nào để cập nhật" };
    }

    values.push(id);

    const sql = `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`;
    await db.query(sql, values);

    return { success: true, message: "Cập nhật danh mục thành công" };
  },

  // (Tùy chọn) Search kết hợp type + name
  searchByTypeAndName: async (category_type, name) => {
    let sql = `
      SELECT 
        id,
        name,
        category_type,
        description,
        parent_id
      FROM categories
      WHERE 1=1
    `;
    const params = [];

    if (category_type && category_type.trim() !== "") {
      sql += " AND category_type = ?";
      params.push(category_type);
    }
    if (name && name.trim() !== "") {
      sql += " AND name LIKE ?";
      params.push(`%${name}%`);
    }

    const [rows] = await db.query(sql, params);
    return rows;
  },
  getAll: async () => {
    const [rows] = await db.query(`SELECT 
        id,
        name, 
        category_type, 
        description, 
        parent_id 
      FROM categories`);
    return rows;
  },
};

module.exports = CategoryService;
