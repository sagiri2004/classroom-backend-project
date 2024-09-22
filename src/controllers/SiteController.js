const db = require("~/models");
const flashcardService = require("~/services/flashcardService");

class SiteController {
  async getHomePage(req, res) {
    try {
      const user = req.user;
      const result = await flashcardService.getHomePage(user);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        EM: "Internal server error",
        EC: 1,
      });
    }
  }
}

module.exports = new SiteController();
