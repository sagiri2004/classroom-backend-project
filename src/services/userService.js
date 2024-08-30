const db = require("~/models");

async function getProfile(rawUserData) {
  const user = await db.User.findOne({
    where: { username: rawUserData.username },
    include: db.Profile,
  });

  return {
    EM: "Login successfully",
    EC: 0,
    data: {
      user,
    },
  };
}

module.exports = {
  getProfile,
};