const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const adminController = require("../controllers/admin-contoller");
const uploadMiddleware = require("../middlewares/upload");
const router = express.Router();

router.post(
  "/product",
  authenticateMiddleware,
  uploadMiddleware.single("imageUrl"),
  adminController.createProduct
);
router.get("/product", authenticateMiddleware, adminController.getProduct);

// router.patch(
//   "/order",
//   authenticateMiddleware,
//   adminController.changeStatusOrder
// );

module.exports = router;
