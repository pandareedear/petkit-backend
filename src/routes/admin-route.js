const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const adminController = require("../controllers/admin-contoller");
const uploadMiddleware = require("../middlewares/upload");
const router = express.Router();
const changeStatusOrder = require("../controllers/admin-contoller");

router.post(
  "/product",
  authenticateMiddleware,
  uploadMiddleware.single("imageUrl"),
  adminController.createProduct
);
router.get("/product", authenticateMiddleware, adminController.getProduct);

router.patch(
  "/order/:orderId",
  authenticateMiddleware,
  adminController.changeStatusOrder
);

router.delete(
  "/order/:orderId",
  authenticateMiddleware,
  adminController.removeOrder
);
module.exports = router;
