const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.patch("/address", authenticateMiddleware, authController.editAddress);
router.get("/me", authenticateMiddleware, authController.getMe);
module.exports = router;
