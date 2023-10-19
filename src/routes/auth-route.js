const express = require("express");
const authController = require("../controllers/auth-controller");
const cartController = require("../controllers/cart-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const router = express.Router();

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
router.delete(
  "/cart/:cartId",
  authenticateMiddleware,
  cartController.removeCart
);
router.get("/me", authenticateMiddleware, authController.getMe);
module.exports = router;
