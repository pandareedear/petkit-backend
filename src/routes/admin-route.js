const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const { createProduct } = require("../controllers/admin-contoller");
const router = express.Router();

router.post("/product", authenticateMiddleware, createProduct);

module.exports = router;
