const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const isAdminMiddleware = require("../middlewares/isAdminMiddleware");
const adminController = require("../controllers/admin-contoller");
const uploadMiddleware = require("../middlewares/upload");
const router = express.Router();
const changeStatusOrder = require("../controllers/admin-contoller");
router.post(
  "/product",
  uploadMiddleware.single("imageUrl"),
  adminController.createProduct
);
router.get("/product", adminController.getProduct);

router.patch("/order/:orderId", adminController.changeStatusOrder);

router.delete("/order/:orderId", adminController.removeOrder);

router.delete("/product/:productId", adminController.removeProduct);

router.patch(
  "/product/:productId",
  uploadMiddleware.single("imageUrl"),
  adminController.editProduct
);
module.exports = router;
