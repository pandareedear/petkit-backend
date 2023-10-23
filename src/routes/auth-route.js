const express = require("express");
const authController = require("../controllers/auth-controller");
const cartController = require("../controllers/cart-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const router = express.Router();
const uploadMiddleware = require("../middlewares/upload");
const getOrderHistory = require("../controllers/auth-controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.patch("/address", authenticateMiddleware, authController.editAddress);
// router.patch(
//   "/address",
//   authenticateMiddleware,
//   authController.checkoutAddress
// );
router.post("/cart", authenticateMiddleware, cartController.addToCart);
router.get("/cart", authenticateMiddleware, cartController.getCart);
router.patch(
  "/cart",
  authenticateMiddleware,
  cartController.changeCartQuantity
);
router.delete(
  "/cart/:cartId",
  authenticateMiddleware,
  cartController.removeCart
);
router.get("/me", authenticateMiddleware, authController.getMe);
router.post(
  "/upload-slip/:orderId",
  authenticateMiddleware,
  uploadMiddleware.single("slipImageUrl"),
  authController.uploadSlip
);

router.get(
  "/account/order",
  authenticateMiddleware,
  authController.getOrderHistory
);
module.exports = router;
