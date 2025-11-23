const db = require("../config/database.config");

const ProductService = {
  getAllProduct: async () => {
    const [rows] = await db.query(`
            Select id,
            name,
            description,
            avatar,
            base_price,
            discount_percent,
            rating_avg,
            total_reviews
            from products`);
    return rows;
  },
  getProductByCategoryType: async (categoryType) => {
    const [rows] = await db.query(
      `
      SELECT 
          p.id,
          p.name,
          p.description,
          p.avatar,
          p.base_price,
          p.discount_percent,
          p.rating_avg,
          p.total_reviews
      FROM products p
      INNER JOIN product_category pc 
          ON p.id = pc.product_id
      WHERE pc.category_type = ?`,
      categoryType
    );
    return rows;
  },
  getProductByCategoryId: async (categoryId) => {
    const [rows] = await db.query(
      `
      SELECT 
          p.id,
          p.name,
          p.description,
          p.avatar,
          p.base_price,
          p.discount_percent,
          p.rating_avg,
          p.total_reviews
      FROM products p
      INNER JOIN product_category pc 
          ON p.id = pc.product_id
      WHERE pc.category_id = ?`,
      categoryId
    );
    return rows;
  },
  // Lấy detail
  getProductById: async (id) => {
    const [rows] = await db.query(
      `
      SELECT 
          id,
          name,
          description,
          avatar,
          base_price,
          discount_percent,
          rating_avg,
          total_reviews
      FROM products
      WHERE id = ?`,
      id
    );
    if (rows.length === 0) throw new Error("Không tìm thấy sản phẩm");
    return rows;
  },
  // Lấy ra tất cả hình ảnh của sản phẩm
  getProductImages: async (productId) => {
    const [rows] = await db.query(
      `
      select id,
        image_url,
        sort_order
      from product_images
      where product_id = ?`,
      productId
    );
    return rows;
  },
  // Lấy ra thuộc tính của sản phẩm
  getProductVariant: async (productId) => {
    const [rows] = await db.query(
      `
      select id,
        variant_type,
        variant_value
      from product_variants
      where product_id = ?`,
      productId
    );
    return rows;
  },
  // Lấy ra sản phẩm kèm theo
  getProductAddon: async (productId) => {
    const [rows] = await db.query(
      `
      select id,
        addon_name,
        extra_price
      from product_addons
      where product_id = ?`,
      productId
    );
    return rows;
  },
  // Lấy khuyến mãi
  getPromotions: async () => {
    const [rows] = await db.query(`
      select id, 
        code,
        discount_type,
        discount_value,
        min_order_value,
        max_usage,
        used_count,
        valid_from,
        valid_to,
        status
      from promotions`);
    return rows;
  },
  getActivePromotions: async () => {
    const [rows] = await db.query(`
    SELECT 
      id,
      code,
      discount_type,
      discount_value,
      min_order_value,
      max_usage,
      used_count,
      valid_from,
      valid_to,
      status
    FROM promotions
    WHERE status = 'active'
      AND (valid_from IS NULL OR valid_from <= NOW())
      AND (valid_to IS NULL OR valid_to >= NOW())
      AND (max_usage = 0 OR used_count < max_usage)
  `);
    return rows;
  },
  // search
  searchProductByName: async (keyword) => {
    const [rows] = await db.query(
      `
    SELECT 
      id,
      name,
      description,
      avatar,
      base_price,
      discount_percent,
      rating_avg,
      total_reviews
    FROM products
    WHERE name LIKE ?`,
      [`%${keyword}%`]
    );
    return rows;
  },
  //them san pham
  addProduct: async (productData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1️⃣ Thêm sản phẩm chính
      const [result] = await connection.query(
        `INSERT INTO products (name, description, avatar, base_price, discount_percent)
       VALUES (?, ?, ?, ?, ?)`,
        [
          productData.name,
          productData.description || null,
          productData.avatar || null,
          productData.base_price,
          productData.discount_percent || 0,
        ]
      );
      const productId = result.insertId;

      // 2️⃣ Thêm ảnh phụ (nếu có)
      if (productData.images && productData.images.length > 0) {
        const imageValues = productData.images.map((img) => [
          productId,
          img.image_url,
          img.sort_order || 0,
        ]);
        await connection.query(
          `INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?`,
          [imageValues]
        );
      }

      // 3️⃣ Thêm variants (nếu có)
      if (productData.variants && productData.variants.length > 0) {
        const variantValues = productData.variants.map((v) => [
          productId,
          v.variant_type,
          v.variant_value,
        ]);
        await connection.query(
          `INSERT INTO product_variants (product_id, variant_type, variant_value) VALUES ?`,
          [variantValues]
        );
      }

      // 4️⃣ Thêm addons (nếu có)
      if (productData.addons && productData.addons.length > 0) {
        const addonValues = productData.addons.map((a) => [
          productId,
          a.addon_name,
          a.extra_price || 0,
        ]);
        await connection.query(
          `INSERT INTO product_addons (product_id, addon_name, extra_price) VALUES ?`,
          [addonValues]
        );
      }

      // 5️⃣ Gán danh mục (nếu có)
      if (productData.categories && productData.categories.length > 0) {
        const categoryValues = productData.categories.map((c) => [
          productId,
          c.category_id,
          c.category_type || "occasion",
        ]);
        await connection.query(
          `INSERT INTO product_category (product_id, category_id, category_type) VALUES ?`,
          [categoryValues]
        );
      }

      await connection.commit();
      return { success: true, productId };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
  //update
  updateProduct: async (id, productData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1️⃣ Update sản phẩm chính
      await connection.query(
        `UPDATE products 
       SET name=?, description=?, avatar=?, base_price=?, discount_percent=?
       WHERE id=?`,
        [
          productData.name,
          productData.description || null,
          productData.avatar || null,
          productData.base_price,
          productData.discount_percent || 0,
          id,
        ]
      );

      // 2️⃣ Xóa ảnh phụ, variants, addons, categories cũ
      await connection.query(`DELETE FROM product_images WHERE product_id=?`, [
        id,
      ]);
      await connection.query(
        `DELETE FROM product_variants WHERE product_id=?`,
        [id]
      );
      await connection.query(`DELETE FROM product_addons WHERE product_id=?`, [
        id,
      ]);
      await connection.query(
        `DELETE FROM product_category WHERE product_id=?`,
        [id]
      );

      // 3️⃣ Thêm lại ảnh phụ (nếu có)
      if (productData.images && productData.images.length > 0) {
        const imageValues = productData.images.map((img) => [
          id,
          img.image_url,
          img.sort_order || 0,
        ]);
        await connection.query(
          `INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?`,
          [imageValues]
        );
      }

      // 4️⃣ Thêm lại variants
      if (productData.variants && productData.variants.length > 0) {
        const variantValues = productData.variants.map((v) => [
          id,
          v.variant_type,
          v.variant_value,
        ]);
        await connection.query(
          `INSERT INTO product_variants (product_id, variant_type, variant_value) VALUES ?`,
          [variantValues]
        );
      }

      // 5️⃣ Thêm lại addons
      if (productData.addons && productData.addons.length > 0) {
        const addonValues = productData.addons.map((a) => [
          id,
          a.addon_name,
          a.extra_price || 0,
        ]);
        await connection.query(
          `INSERT INTO product_addons (product_id, addon_name, extra_price) VALUES ?`,
          [addonValues]
        );
      }

      // 6️⃣ Thêm lại categories
      if (productData.categories && productData.categories.length > 0) {
        const categoryValues = productData.categories.map((c) => [
          id,
          c.category_id,
          c.category_type || "occasion",
        ]);
        await connection.query(
          `INSERT INTO product_category (product_id, category_id, category_type) VALUES ?`,
          [categoryValues]
        );
      }

      await connection.commit();
      return { success: true };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
  // gán thêm mà không xóa danh mục cũ
  addCategoriesToProduct: async (productId, categories) => {
    if (!categories || categories.length === 0) return;
    const values = categories.map((c) => [
      productId,
      c.category_id,
      c.category_type || "occasion",
    ]);
    await db.query(
      `INSERT IGNORE INTO product_category (product_id, category_id, category_type) VALUES ?`,
      [values]
    );
  },
  getPromotionByCode: async (code) => {
    const [rows] = await db.query(
      `
      select id, 
        code,
        discount_type,
        discount_value,
        min_order_value,
        max_usage,
        used_count,
        valid_from,
        valid_to,
        status
      from promotions
      where code = ?`,
      code
    );
    return rows;
  },
};

module.exports = ProductService;
