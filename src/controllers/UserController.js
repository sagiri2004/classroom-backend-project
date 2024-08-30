const db = require("../models");

class UserController {
  async createProfile(req, res) {
    const { firstName, lastName, bio } = req.body;
    const { id } = req.user;
    const avatar = req.file.path;

    try {
      const profile = await db.Profile.create({
        firstName,
        lastName,
        bio,
        avatar,
        userId: id,
      });

      return res.json({
        EM: "Create profile successfully",
        EC: 0,
        data: {
          profile,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        EM: "Internal server error",
        EC: 1,
      });
    }
  }
}

module.exports = new UserController();
