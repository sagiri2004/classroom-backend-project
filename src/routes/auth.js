const express = require("express");
const router = express.Router();
const authController = require("~/controllers/AuthController");
const authenticateToken = require("~/middleware/authenticateToken");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout);
router.get("/my-profile", authenticateToken, authController.myProfile);
router.put("/change-profile", authenticateToken, authController.changeProfile);
router.get("/refresh-token", authController.refreshToken);

module.exports = router;
