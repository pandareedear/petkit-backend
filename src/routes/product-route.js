const express = require("express");
const productController = require("../controllers/product-controller");
const router = express.Router();

router.get("/", productController.getProduct);
router.get("/product/:productId", productController.getProductById);

module.exports = router;
