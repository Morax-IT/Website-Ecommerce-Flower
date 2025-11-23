const db = require("../config/database.config");

const ReviewService = {
  getReviewByProductId: async (productId) => {
    const [reviews] = await db.query(
      `
      SELECT 
        r.id AS review_id,
        u.name AS user_name,
        r.rating,
        r.comment,
        r.created_at
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      `,
      [productId]
    );

    // Nếu không có đánh giá thì return luôn
    if (!reviews.length) return [];

    // Lấy toàn bộ review_id để query media một lần duy nhất
    const reviewIds = reviews.map((r) => r.review_id);
    const [media] = await db.query(
      `
      SELECT 
        review_id,
        media_url,
        media_type
      FROM review_media
      WHERE review_id IN (?)
      `,
      [reviewIds]
    );

    // Nhóm media theo review_id
    const mediaMap = {};
    for (const item of media) {
      if (!mediaMap[item.review_id]) mediaMap[item.review_id] = [];
      mediaMap[item.review_id].push({
        url: item.media_url,
        type: item.media_type,
      });
    }

    // Gắn media vào từng review
    const result = reviews.map((review) => ({
      review_id: review.review_id,
      user_name: review.user_name,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      media: mediaMap[review.review_id] || [],
    }));

    return result;
  },
  getAllReview: async () => {
    const [reviews] = await db.query(`
    SELECT 
      r.id AS review_id,
      r.product_id,
      r.user_id,
      u.name AS user_name,
      r.rating,
      r.comment,
      r.created_at
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `);

    if (!reviews.length) return [];

    // Lấy toàn bộ review_id để query media
    const reviewIds = reviews.map((r) => r.review_id);
    const [media] = await db.query(
      `
    SELECT 
      review_id,
      media_url,
      media_type
    FROM review_media
    WHERE review_id IN (?)
    `,
      [reviewIds]
    );

    // Nhóm media theo review_id
    const mediaMap = {};
    for (const item of media) {
      if (!mediaMap[item.review_id]) mediaMap[item.review_id] = [];
      mediaMap[item.review_id].push({
        url: item.media_url,
        type: item.media_type,
      });
    }

    // Gắn media vào từng review
    const result = reviews.map((review) => ({
      review_id: review.review_id,
      product_id: review.product_id,
      user_id: review.user_id,
      user_name: review.user_name,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      media: mediaMap[review.review_id] || [],
    }));

    return result;
  },
  // Tạo mới review cho một user
  createReview: async ({
    user_id,
    product_id,
    rating,
    comment,
    media = [],
  }) => {
    const [result] = await db.query(
      `
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES (?, ?, ?, ?)
      `,
      [user_id, product_id, rating, comment]
    );

    const reviewId = result.insertId;

    // Thêm media nếu có
    for (const item of media) {
      await db.query(
        `
        INSERT INTO review_media (review_id, media_url, media_type)
        VALUES (?, ?, ?)
        `,
        [reviewId, item.url, item.type]
      );
    }

    return { review_id: reviewId };
  },
  // Cập nhật review (chỉ khi user là chủ sở hữu)
  updateReview: async ({ review_id, user_id, rating, comment, media = [] }) => {
    const [[review]] = await db.query(`SELECT * FROM reviews WHERE id = ?`, [
      review_id,
    ]);
    if (!review) throw new Error("Review not found");
    if (review.user_id !== user_id) throw new Error("Permission denied");

    await db.query(
      `
      UPDATE reviews
      SET rating = ?, comment = ?
      WHERE id = ?
      `,
      [rating, comment, review_id]
    );

    // Xoá media cũ → thêm media mới
    await db.query(`DELETE FROM review_media WHERE review_id = ?`, [review_id]);
    for (const item of media) {
      await db.query(
        `INSERT INTO review_media (review_id, media_url, media_type)
         VALUES (?, ?, ?)`,
        [review_id, item.url, item.type]
      );
    }

    return { success: true };
  },
  // Xoá review nếu là chủ sở hữu
  deleteReview: async ({ review_id, user_id }) => {
    const [[review]] = await db.query(`SELECT * FROM reviews WHERE id = ?`, [
      review_id,
    ]);
    if (!review) throw new Error("Review not found");
    if (review.user_id !== user_id) throw new Error("Permission denied");

    await db.query(`DELETE FROM review_media WHERE review_id = ?`, [review_id]);
    await db.query(`DELETE FROM reviews WHERE id = ?`, [review_id]);

    return { success: true };
  },
};

module.exports = ReviewService;
