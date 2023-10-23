const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerSchema,
  loginSchema,
  addressSchema,
  createProductSchema,
} = require("../validators/auth-validator");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

exports.addToCart = async (req, res, next) => {
  console.log("req.body", req.body);
  try {
    let cart;
    const checkCart = await prisma.cart.findFirst({
      where: {
        userId: req.user.id,
        productId: req.body.productId,
      },
    });
    console.log("chwckcart------------>", checkCart);
    if (!checkCart) {
      cart = await prisma.cart.create({
        data: {
          userId: req.user.id,
          productId: req.body.productId,
          totalPrice: req.body.price * req.body.quantity,
          quantity: req.body.quantity,
        },
      });
    }
    if (checkCart) {
      cart = await prisma.cart.update({
        where: {
          id: checkCart.id,
        },
        data: {
          quantity: req.body.quantity,
          totalPrice: req.body.price * req.body.quantity,
        },
      });
    }
    res.status(200).json({ cart });
  } catch (err) {
    next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    console.log("users", req.user);
    const cart = await prisma.cart.findMany({
      where: {
        userId: +req.user.id,
      },
      include: {
        Product: {
          include: {
            product: {
              select: {
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ cart });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.removeCart = async (req, res, next) => {
  const { cartId } = req.params;
  console.log(cartId);
  try {
    const cart = await prisma.cart.deleteMany({
      where: {
        id: parseInt(cartId),
      },
    });
    res.status(200).json({ cart });
  } catch (err) {
    next(err);
  }
};

exports.changeCartQuantity = async (req, res, next) => {
  console.log("req.body", req.body);
  try {
    const checkCartId = await prisma.cart.findFirst({
      where: {
        id: req.body.id,
      },
    });
    console.log("---checkCartId----", checkCartId);
    cart = await prisma.cart.update({
      where: {
        id: req.body.id,
      },
      data: {
        quantity: req.body.quantity,
        totalPrice: req.body.price * req.body.quantity,
      },
    });
    res.status(201).json({ cart });
  } catch (err) {
    next(err);
  }
};
