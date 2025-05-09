const router = require("express").Router();

const {
  addToCart,
  createOrder,
  getCart,
  removeFromCart,
  getMyOrders,
} = require("../controller/order.controller");

const authMiddleware = require("../middleware/authMIddleware");


router.post("/add-to-cart", authMiddleware, addToCart);
router.post("/checkout", authMiddleware, createOrder);
router.get("/cart", authMiddleware, getCart);
router.delete("/remove-from-cart/:id", authMiddleware, removeFromCart);
router.get("/my-order", authMiddleware, getMyOrders);

module.exports = router;