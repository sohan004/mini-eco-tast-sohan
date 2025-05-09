const { Prisma } = require("@prisma/client");
const { db } = require("../db.config");
const asyncErrorCatcher = require("../middleware/asyncErrorCatcher");
const fileUpload = require("../utilities/fileUpload");
const { default: axios } = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.createProduct = asyncErrorCatcher(async (req, res) => {
  const body = await req.body;
  const file = await req.files.file;
  const fileName = await fileUpload(file);
  const product = await db.product.create({
    data: {
      name: body.name,
      description: body.description,
      discount: +body.discount,
      price: +body.price,
      categoryId: +body.categoryId,
      stock: +body.stock,
      image: fileName,
    },
  });
  res.json({
    status: true,
    message: "Product created successfully",
  });
});

module.exports.updateProduct = asyncErrorCatcher(async (req, res) => {
  const { id } = await req.params;
  const body = await req.body;
  const product = await db.product.update({
    where: {
      id: Number(id),
    },
    data: {
      ...body,
    },
  });
  res.json({
    status: true,
    message: "Product updated successfully",
  });
});

module.exports.deleteProduct = asyncErrorCatcher(async (req, res) => {
  const { id } = await req.params;
  const product = await db.product.delete({
    where: {
      id: Number(id),
    },
  });
  res.json({
    status: true,
    message: "Product deleted successfully",
  });
});

module.exports.getProductDetailsById = asyncErrorCatcher(async (req, res) => {
  const { id } = await req.params;
  const product = await db.product.findUnique({
    where: {
      id: Number(id),
      stock: {
        gt: 0,
      },
    },
    include: {
      Review: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      category: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  res.json({
    status: true,
    message: "Product fetched successfully",
    data: product,
  });
});

module.exports.filterSearchProduct = asyncErrorCatcher(async (req, res) => {
  const {
    take = 10,
    skip = 0,
    search,
    price_start,
    price_end,
    rating,
    category,
    price_sort,
  } = req.query;

  const searchQuery = search ? `%${search}%` : null;
  const parsedPriceStart = price_start ? parseFloat(price_start) : null;
  const parsedPriceEnd = price_end ? parseFloat(price_end) : null;
  const parsedRating = rating ? parseFloat(rating) : null;
  const priceSort =
    price_sort?.toLowerCase() === "asc"
      ? "ASC"
      : price_sort?.toLowerCase() === "desc"
      ? "DESC"
      : null;

  const categoryArray = category
    ? category.split(",").map((id) => parseInt(id.trim()))
    : null;

  const categoryFilter =
    categoryArray?.length > 0
      ? Prisma.sql`AND p.categoryId IN (${Prisma.join(categoryArray)})`
      : Prisma.empty;

  const orderClause = priceSort
    ? Prisma.sql`ORDER BY (p.price - p.discount) ${Prisma.raw(priceSort)}`
    : Prisma.sql`ORDER BY p.createdAt DESC`;

  const query = Prisma.sql`
    SELECT 
      p.*, 
      (p.price - p.discount) AS discountPrice,
      COUNT(r.id) AS totalReviews, 
      AVG(r.rating) AS avgRating
    FROM Product p
    LEFT JOIN Review r ON p.id = r.productId
    WHERE 
      (${search} IS NULL OR p.name LIKE ${searchQuery} OR p.description LIKE ${searchQuery})
      AND (${price_start} IS NULL OR (p.price - p.discount) >= ${parsedPriceStart})
      AND (${price_end} IS NULL OR (p.price - p.discount) <= ${parsedPriceEnd})
      AND p.stock > 0
      ${categoryFilter}
    GROUP BY p.id
    HAVING 
      (${rating} IS NULL OR IFNULL(avgRating, 0) >= ${parsedRating})
    ${orderClause}
    LIMIT ${parseInt(take)} OFFSET ${parseInt(skip)};
  `;

  const products = await db.$queryRaw(query);

  const safeProducts = products.map((product) => ({
    ...product,
    totalReviews: Number(product.totalReviews),
    avgRating: Number(product.avgRating),
  }));

  res.json({
    success: true,
    products: safeProducts,
  });
});
