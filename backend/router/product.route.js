const router = require("express").Router();
const {
  createProduct,
  deleteProduct,
  filterSearchProduct,
  updateProduct,
  getProductDetailsById,
} = require("../controller/product.controller");
const authMiddleware = require("../middleware/authMIddleware");

router.post("/create",  createProduct);
router.put("/update/:id", authMiddleware, updateProduct);
router.delete("/delete/:id", authMiddleware, deleteProduct);
router.get("/filter", filterSearchProduct);
router.get("/details/:id", getProductDetailsById);

module.exports = router;
