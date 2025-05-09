const { db } = require("../db.config");
const asyncErrorCatcher = require("../middleware/asyncErrorCatcher");
const fileUpload = require("../utilities/fileUpload");

module.exports.createCategory = asyncErrorCatcher(async (req, res) => {
  const file = await req.files.file;
  const { name, image } = await req.body;
  const fileName = await fileUpload(file);
  const category = await db.category.create({
    data: {
      name,
      image: fileName,
    },
  });
  res.json({
    status: true,
    message: "Category created successfully",
  });
});

module.exports.getAllCategories = asyncErrorCatcher(async (req, res) => {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
  res.json({
    status: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});

module.exports.deleteCategory = asyncErrorCatcher(async (req, res) => {
  const { id } = await req.params;
  const category = await db.category.delete({
    where: {
      id: Number(id),
    },
  });
  res.json({
    status: true,
    message: "Category deleted successfully",
  });
})
;
