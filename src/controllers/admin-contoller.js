const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { createProductSchema } = require("../validators/auth-validator");
const { required } = require("joi");
const { upload } = require("../utils/cloudinary-service");

exports.createProduct = async (req, res, next) => {
  console.log("req.body", req.body);
  // console.dir(req.file.path);
  try {
    const { value, error } = createProductSchema.validate(req.body);
    console.log("value", value);

    if (error) {
      return next(error);
    }

    const productDup = await prisma.product.findFirst({
      where: {
        productName: value.productName,
      },
    });
    if (productDup) {
      return next(createError("Already add this product name", 400));
    }
    console.log("testCreate");

    const product = await prisma.product.create({
      data: {
        productName: value.productName,
        description: value.description,
        enumCategory: value.enumCategory,
        price: value.price,
      },
    });

    const productImageDup = await prisma.productImage.findFirst({
      where: {
        productId: product.id,
      },
    });

    if (productImageDup) {
      return next(createError("Already add this product name", 400));
    }
    console.log(product.id);

    const imageUrl = await upload(req.file.path);
    console.log(imageUrl);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const productImage = await prisma.productImage.create({
      data: {
        productId: product.id,
        imageUrl: imageUrl,
      },
    });

    res
      .status(201)
      .json({ msg: "create product successfully", product, productImage });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        product: {
          select: {
            imageUrl: true,
          },
        },
      },
    });
    console.log(products);
    res.status(200).json({ products });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.changeStatusOrder = async (req, res, next) => {
  console.log("req.body", req.body);
  // const id = req.params;
  console.log(req.params);
  const { orderId } = req.params;
  const { paymentStatus } = req.body;
  console.log(paymentStatus);
  console.log(orderId);
  try {
    const checkOrderId = await prisma.order.findFirst({
      where: {
        id: +orderId,
      },
    });
    console.log(checkOrderId);
    changeStatus = await prisma.order.update({
      where: {
        id: +orderId,
      },
      data: {
        paymentStatus: req.body.paymentStatus,
      },
    });
    res.status(200).json({ changeStatus });
  } catch (err) {
    next(err);
  }
};

exports.removeOrder = async (req, res, next) => {
  const { orderId } = req.params;
  console.log(orderId);
  try {
    const orderItem = await prisma.orderItem.deleteMany({
      where: {
        orderId: +orderId,
      },
    });
    const order = await prisma.order.deleteMany({
      where: {
        id: +orderId,
      },
    });
    res.status(200).json({ orderItem, order });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};
