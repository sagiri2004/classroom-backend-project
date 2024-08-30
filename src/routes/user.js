const express = require("express");
const router = express.Router();
const useController = require("~/controllers/UserController");
const authenticateToken = require("~/middleware/authenticateToken");
const upload = require("~/config/cloudinary");

router.get("/profile", authenticateToken, useController.profile);
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

module.exports = router;
