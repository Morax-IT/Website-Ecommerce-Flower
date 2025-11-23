const express = require("express");
const ReviewController = require("../controllers/review.controller");
const router = express.Router();

router.get("/:id", ReviewController.getReviewByProductId);
router.get("/", ReviewController.getAllReview);
router.post("/", ReviewController.createReview);
router.put("/:id", ReviewController.updateReview);
router.delete("/:id", ReviewController.deleteReview);

module.exports = router;
