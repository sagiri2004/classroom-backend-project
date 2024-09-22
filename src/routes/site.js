const express = require("express");
const router = express.Router();
const siteController = require("~/controllers/SiteController");
const authenticateToken = require("~/middleware/authenticateToken");

router.get("/",authenticateToken, siteController.getHomePage);

module.exports = router;
