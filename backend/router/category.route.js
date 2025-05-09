const router = require("express").Router();

const {
  createCategory,
  getAllCategories,
  deleteCategory,
} = require("../controller/category.controller");

router.post("/create", createCategory);
router.get("/all", getAllCategories);
router.delete("/delete/:id", deleteCategory);

module.exports = router;
