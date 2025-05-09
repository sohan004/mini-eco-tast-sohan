const router = require("express").Router();
const {
  createReview,
  deleteReview,
  getReviewByProductId,
  updateReview,
} = require("../controller/review.controller");
const authMiddleware = require("../middleware/authMIddleware");

router.post("/", authMiddleware, createReview);
router.delete("/:id", authMiddleware, deleteReview);
router.get("/:productId", authMiddleware, getReviewByProductId);
router.put("/:id", authMiddleware, updateReview);
