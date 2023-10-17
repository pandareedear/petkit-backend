const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { createProductSchema } = require("../validators/auth-validator");

exports.createProduct = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const { value, error } = createProductSchema.validate(req.body);
    console.log("value", value);
    console.log("error", error);
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

    const product = await prisma.product.create({
      data: value,
    });
    const payload = { productId: product.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "dfwueyqiuhdjkbsajkbd",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    // delete user.pasword;
    res.status(201).json({ accessToken, product });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
