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
const { upload } = require("../utils/cloudinary-service");

exports.register = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const { value, error } = registerSchema.validate(req.body);
    console.log("value", value);
    if (error) {
      return next(error);
    }
    value.password = await bcrypt.hash(value.password, 12);
    const emailDup = await prisma.user.findUnique({
      where: {
        email: value.email,
      },
    });
    if (emailDup) {
      return next(createError("email is already used", 400));
    }

    const user = await prisma.user.create({
      data: value,
    });
    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "dfwueyqiuhdjkbsajkbd",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    delete user.password;
    res.status(201).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    console.log(value);
    const user = await prisma.user.findFirst({
      where: {
        email: value.email,
      },
    });
    if (!user) {
      return next(createError("incorrect email or password", 400));
    }

    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return next(createError("incorrect email or password", 400));
    }

    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "dfwueyqiuhdjkbsajkbd",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    delete user.password;
    res.status(200).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

exports.editAddress = async (req, res, next) => {
  try {
    const { checkOut } = req.query;
    console.log(checkOut, "checkoutja");
    const { value, error } = addressSchema.validate(req.body);
    console.log("value", value);
    if (error) {
      return next(error);
    }
    const mobileDup = await prisma.user.findFirst({
      where: {
        mobile: value.mobile,
      },
    });
    if (mobileDup) {
      return next(createError("This phone number is already used", 400));
    }

    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        mobile: value.mobile,
        address: value.address,
        city: value.city,
        zipCode: value.zipCode,
        country: value.country,
        province: value.province,
      },
    });
    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "dfwueyqiuhdjkbsajkbd",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    console.log(req.user.id);

    let carts;
    let totalPrice;
    let order;
    let orderItem;
    let deleteCart;

    if (checkOut) {
      carts = await prisma.cart.findMany({
        where: {
          userId: +req.user.id,
        },
      });

      console.log(carts);

      totalPrice = carts.reduce((acc, el) => {
        acc += +el.totalPrice;
        return acc;
      }, 0);

      console.log("totalPrice", totalPrice);

      order = await prisma.order.create({
        data: {
          userId: req.user.id,
          totalPrice: totalPrice,
        },
      });
      console.log("CART AI SUS", carts);
      await Promise.all(
        carts.map((cart) =>
          prisma.orderItem.create({
            data: {
              quantity: cart.quantity,
              totalPrice: cart.totalPrice,
              orderId: order.id,
              productId: order.userId,
            },
          })
        )
      );
      // ใช้Promise.all เพราะว่าต้องครีเอต จากcart ลง orderitem ซึ่งมันมีของในcartมากกว่าหนึ่งอันเลยใช้ Promise.all
      //[PROMISEPENDING,PROMISEPENDING] ต้องคลี่ด้วย promise.all([])
      const deleteCart = await prisma.cart.deleteMany({
        where: {
          userId: req.user.id,
        },
      });
    }
    console.log("ORDER", order);
    res.status(201).json({ user, carts, order, orderItem, deleteCart });
  } catch (err) {
    next(err);
  }
};

exports.uploadSlip = async (req, res, next) => {
  const orderId = +req.params.orderId;
  console.log(orderId, "orederId");
  console.dir(req.file.path);
  try {
    console.log("testUpload");
    // console.log("REQ FILE", req.file);

    const slipImageUrl = await upload(req.file.path);
    console.log(slipImageUrl);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadedSlip = await prisma.order.update({
      where: {
        id: parseInt(orderId),
      },
      data: {
        slipImageUrl: slipImageUrl,
        paymentDate: {
          set: new Date(),
        },
      },
    });

    res
      .status(201)
      .json({ message: "test upload image successfully", uploadedSlip });
  } catch (err) {
    console.log(err);
  }
};

exports.getOrderHistory = async (req, res, next) => {
  console.log(req.user.id, "userId");
  try {
    const order = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
    });
    console.log(order);
    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
};

exports.changeStatusOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.body.id,
      },
    });
    const changeStatus = await prisma.order.patch({
      data: {
        paymentStatus: req.body.paymentStatus,
      },
    });
    res.status(200).json({ changeStatus });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};
