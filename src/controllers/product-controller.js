const prisma = require("../models/prisma");

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

exports.getProductById = async (req, res, next) => {
  const productId = +req.params.productId;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        product: {
          select: {
            imageUrl: true,
          },
        },
      },
    });
    // console.log({ product });
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
