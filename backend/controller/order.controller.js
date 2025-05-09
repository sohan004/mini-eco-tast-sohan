const { db } = require("../db.config");
const asyncErrorCatcher = require("../middleware/asyncErrorCatcher");
const redis = require("../redis.config");
const { cartKey } = require("../utilities/redisKey");

module.exports.createOrder = asyncErrorCatcher(async (req, res) => {
  const body = await req.body;
  const key = await cartKey(req.user.id);


  const order = await db.order.create({
    data: {
      totalAmount: +body?.totalAmount,
      userId: +req.user.id,
      quantity: +body?.quantity,
      orderItems: {
        create: body?.orderItems?.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  await Promise.all(
    body.orderItems.map(async (item) => {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    })
  );

  await redis.del(key);

  res.json({
    status: true,
    message: "Order created successfully",
    data: order,
  });
});

module.exports.addToCart = asyncErrorCatcher(async (req, res) => {
  const key = await cartKey(req.user.id);
  const { id, name, price, image, quantity, decrease } = await req.body;
  let cart = [];
  cart = JSON.parse(await redis.get(key)) || [];
  const product = cart.find((item) => item.id === id);
  if (product) {
    if (decrease) {
      product.quantity -= 1;
      if (product.quantity <= 0) {
        cart = cart.filter((item) => item.id !== id);
      }
    } else {
      product.quantity += 1;
    }
  } else {
    cart.push({ id, name, price, image, quantity });
  }

  await redis.set(key, JSON.stringify(cart));
  res.json({
    status: true,
    message: "Product added to cart successfully",
    data: cart,
  });
});

module.exports.removeFromCart = asyncErrorCatcher(async (req, res) => {
  const key = await cartKey(req.user.id);
  const { id } = await req.params;
  let cart = JSON.parse(await redis.get(key)) || [];
  cart = cart.filter((item) => +item.id !== +id);
  await redis.set(key, JSON.stringify(cart));
  res.json({
    status: true,
    message: "Product removed from cart successfully",
    data: cart,
  });
});

module.exports.getCart = asyncErrorCatcher(async (req, res) => {
  const key = await cartKey(req.user.id);
  const cart = JSON.parse(await redis.get(key)) || [];
  res.json({
    status: true,
    message: "Cart fetched successfully",
    data: cart,
  });
});


module.exports.getMyOrders = asyncErrorCatcher(async (req, res) => {
  const orders = await db.order.findMany({
    where: {
      userId: +req.user.id,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
  res.json({
    status: true,
    message: "Orders fetched successfully",
    data: orders,
  });
})