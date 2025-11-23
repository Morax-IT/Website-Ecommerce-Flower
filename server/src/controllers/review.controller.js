const ReviewService = require("../services/review.service");

const ReviewController = {
  getReviewByProductId: async (req, res) => {
    try {
      const productId = req.params.id.toUpperCase();
      const data = await ReviewService.getReviewByProductId(productId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getAllReview: async (req, res) => {
    try {
      const data = await ReviewService.getAllReview();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Tạo review mới
  createReview: async (req, res) => {
    try {
      const { user_id, product_id, rating, comment, media } = req.body;

      if (!user_id || !product_id || !rating) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await ReviewService.createReview({
        user_id,
        product_id,
        rating,
        comment,
        media,
      });

      res.status(201).json({ message: "Review created", ...result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Cập nhật review (chỉ nếu là chủ sở hữu)
  updateReview: async (req, res) => {
    try {
      const review_id = req.params.id;
      const { user_id, rating, comment, media } = req.body;

      if (!user_id || !rating) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await ReviewService.updateReview({
        review_id,
        user_id,
        rating,
        comment,
        media,
      });

      res.json({ message: "Review updated", ...result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Xoá review (chỉ nếu là chủ sở hữu)
  deleteReview: async (req, res) => {
    try {
      const review_id = req.params.id;
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ error: "Missing user_id" });
      }

      const result = await ReviewService.deleteReview({ review_id, user_id });

      res.json({ message: "Review deleted", ...result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = ReviewController;
