require("dotenv").config();
const db = require("~/models");
const jwt = require("jsonwebtoken");
const redis = require("~/config/redis");
const { hashPassword, comparePasswords } = require("~/utils/passwordUtils");

const animalImages = [
  "https://assets.quizlet.com/static/i/animals/126.70ed6cbb19b8447.jpg",
  "https://assets.quizlet.com/static/i/animals/125.a46eeeaa1617163.jpg",
  "https://assets.quizlet.com/static/i/animals/124.e99fa024b6881c1.jpg",
  "https://assets.quizlet.com/static/i/animals/123.e5f0bd4b49e7c12.jpg",
  "https://assets.quizlet.com/static/i/animals/122.c263b6b48ca2b1a.jpg",
  "https://assets.quizlet.com/static/i/animals/121.86d7c15a5a6be0f.jpg",
  "https://assets.quizlet.com/static/i/animals/120.bd14e2049ea1628.jpg",
  "https://assets.quizlet.com/static/i/animals/119.ed0b39ac3915639.jpg",
  "https://assets.quizlet.com/static/i/animals/118.17bed2945aa1600.jpg",
  "https://assets.quizlet.com/static/i/animals/117.3cd40b021ac604f.jpg",
  "https://assets.quizlet.com/static/i/animals/116.9aaedd4f4495837.jpg",
  "https://assets.quizlet.com/static/i/animals/115.70946d9217589e8.jpg",
  "https://assets.quizlet.com/static/i/animals/114.0adc064c9a6d1eb.jpg",
  "https://assets.quizlet.com/static/i/animals/113.e4b7e1c4ed27afa.jpg",
  "https://assets.quizlet.com/static/i/animals/112.c90135dfc341a90.jpg",
  "https://assets.quizlet.com/static/i/animals/111.f9dd73353feb908.jpg",
  "https://assets.quizlet.com/static/i/animals/110.36d90f6882d4593.jpg",
  "https://assets.quizlet.com/static/i/animals/109.5b75ca8158c771c.jpg",
  "https://assets.quizlet.com/static/i/animals/108.3b3090077134db3.jpg",
  "https://assets.quizlet.com/static/i/animals/107.c3e123902d831a9.jpg",
];

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

  const user = await db.User.create({
    username: rawUserData.username,
    email: rawUserData.email,
    password: rawUserData.password,
  });

  const userProfile = {
    userId: user.id,
    firstName: rawUserData.username,
    lastName: "",
    avatar: animalImages[Math.floor(Math.random() * animalImages.length)],
    bio: "I am so handsome (pretty)",
  };

  await db.Profile.create(userProfile);

  return {
    EM: "Register successfully",
    EC: 0,
  };
}

async function changeProfile(userId, rawUserData) {
  const user = await db.User.findOne({
    where: { id: userId },
    include: [
      {
        model: db.Profile,
        as: "profile",
        attributes: ["firstName", "lastName", "avatar", "bio"],
      },
    ],
  });

  if (!user) {
    return {
      EM: "User does not exist",
      EC: 1,
    };
  }

  const updatedProfile = {
    firstName: rawUserData.firstName,
    lastName: rawUserData.lastName,
    avatar: rawUserData.avatar,
    bio: rawUserData.bio,
  };

  await db.Profile.update(updatedProfile, {
    where: { userId: userId },
  });

  return {
    EM: "Update profile successfully",
    EC: 0,
  };
}

async function loginUser(rawUserData, res) {
  const user = await db.User.findOne({
    where: { username: rawUserData.username },
    include: [
      {
        model: db.Profile,
        as: "profile",
        attributes: ["firstName", "lastName", "avatar"],
      },
    ],
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
    { expiresIn: "2h" }
  );
  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
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
        email: user.email,
        profile: {
          firstName: user?.profile?.firstName,
          lastName: user?.profile?.lastName,
          avatar: user?.profile?.avatar,
        },
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

async function getUserProfile(userId) {
  const user = await db.User.findOne({
    where: { id: userId },
    include: [
      {
        model: db.Profile,
        as: "profile",
        attributes: ["firstName", "lastName", "avatar", "bio"],
      },
    ],
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user?.profile?.firstName,
    lastName: user?.profile?.lastName,
    avatar: user?.profile?.avatar,
    bio: user?.profile?.bio,
  };
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  changeProfile,
};
