const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const adminController = require("../controllers/admin-contoller");
const uploadMiddleware = require("../middlewares/upload");
const router = express.Router();

router.post(
  "/product",
  authenticateMiddleware,
  adminController.createProduct,
  uploadMiddleware.single("image")
);

module.exports = router;
