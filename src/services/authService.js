require("dotenv").config();
const db = require("~/models");
const jwt = require("jsonwebtoken");
const redis = require("~/config/redis");
const { hashPassword, comparePasswords } = require("~/utils/passwordUtils");

async function checkEmailExist(email) {
  const user = await db.User.findOne({
    where: { email: email },
  });

  return user ? true : false;
}

async function checkUsernameExist(username) {
  const user = await db.User.findOne({
    where: { username: username },
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

  if (await checkUsernameExist(rawUserData.username)) {
    return {
      EM: "Username already exists",
      EC: 1,
    };
  }

  // Băm mật khẩu trước khi lưu vào cơ sở dữ liệu
  rawUserData.password = await hashPassword(rawUserData.password);

  await db.User.create({
    username: rawUserData.username,
    email: rawUserData.email,
    password: rawUserData.password,
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

  if (!user) {
    return {
      EM: "Username does not exist",
      EC: 1,
    };
  }

  const match = await comparePasswords(rawUserData.password, user.password);

  if (!match) {
    return {
      EM: "Password is incorrect",
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
      user: {
        id: user.id,
        username: user.username,
      },
    },
  };
}

async function logoutUser(rawUserData, res) {
  res.clearCookie("refreshToken");
  // xoá Refresh Token khỏi Redis
  await redis.del(`refreshToken:${rawUserData.id}`);

  return {
    EM: "Logout successfully",
    EC: 0,
  };
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
