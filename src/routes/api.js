const express = require("express");
const router = express.Router();
const apiController = require("../controllers/ApiController");
const useController = require("../controllers/UserController");
const authenticateToken = require("../middleware/authenticateToken");
const upload = require("~/config/cloudinary");

router.post("/register", apiController.register);
router.post("/login", apiController.login);
router.post("/logout", authenticateToken, apiController.logout);
router.get("/profile", authenticateToken, apiController.profile);
router.post(
  "/profile",
  authenticateToken,
  (req, res, next) => {
    try {
      upload.single("image")(req, res, (err) => {
        if (err) {
          console.error(err);
          return res.status(400).json({
            EM: "Upload image failed",
            EC: 4,
          });
        }
        next();
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  useController.createProfile
);
router.get("/refresh-token", apiController.refreshToken);

module.exports = router;
