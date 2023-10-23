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
        productImage: {
          select: {
            productId: true,
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

exports.getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};
