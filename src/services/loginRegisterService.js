require("dotenv").config();
const db = require("../models");
const jwt = require("jsonwebtoken");
const redis = require("../config/redis");

async function checkEmailExist(email) {
  const user = await db.User.findOne({
    where: { email: email },
  });

  return user ? true : false;
}

async function registerUser(rawUserData) {
  if (await checkEmailExist(rawUserData.email)) {
    return {
      EM: "Email already exists",
      EC: 1,
    };
  }

  await db.User.create({
    firstName: rawUserData.firstName,
    lastName: rawUserData.lastName,
    email: rawUserData.email,
    password: rawUserData.password,
    address: rawUserData.address,
    gender: rawUserData.gender,
  });

  return {
    EM: "Register successfully",
    EC: 0,
  };
}

async function loginUser(rawUserData, res) {
  const user = await db.User.findOne({
    where: { username: rawUserData.username },
  });

  if (!user || user.password !== rawUserData.password) {
    return {
      EM: "Invalid email or password",
      EC: 1,
    };
  }

  // Tạo Access Token và Refresh Token
  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Lưu Refresh Token vào Redis
  await redis.set(
    `refreshToken:${user.id}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );

  try {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    //   secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  } catch (err) {
    console.log(err);
  }

  return {
    EM: "Login successfully",
    EC: 0,
    data: {
      accessToken,
    },
  };
}

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
  registerUser,
  loginUser,
  getProfile,
};
