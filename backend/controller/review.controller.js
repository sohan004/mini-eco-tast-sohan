const { db } = require("../db.config");
const asyncErrorCatcher = require("../middleware/asyncErrorCatcher");

module.exports.createReview = asyncErrorCatcher(async (req, res) => {
  const body = await req.body;
  const review = await db.review.create({
    data: body,
  });
  res.json({
    status: true,
    message: "Review created successfully",
  });
});

module.exports.updateReview = asyncErrorCatcher(async (req, res) => {
  const { id } = await req.params;
  const body = await req.body;
  const review = await db.review.update({
    where: {
      id: Number(id),
    },
    data: {
      ...body,
    },
  });
  res.json({
    status: true,
    message: "Review updated successfully",
  });
});

module.exports.deleteReview = asyncErrorCatcher(async (req, res) => {
  const { id } = await req.params;
  const review = await db.review.delete({
    where: {
      id: Number(id),
    },
  });
  res.json({
    status: true,
    message: "Review deleted successfully",
  });
});

module.exports.getReviewByProductId = asyncErrorCatcher(async (req, res) => {
  const { productId } = await req.params;
  const review = await db.review.findMany({
    where: {
      productId: Number(id),
    },
  });
  res.json({
    status: true,
    message: "Review fetched successfully",
    data: review,
  });
});
