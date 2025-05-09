const router = require("express").Router();

router.use("/category", require("./category.route"));
router.use("/auth", require("./auth.route"));
router.use("/product", require("./product.route"));
router.use("/order", require("./order.route"));
router.use("/customer", require("./customer.route"));
router.use("/media", require("./media.route"));


module.exports = router;
