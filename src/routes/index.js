const authRouter = require("./auth");
const userRouter = require("./user");

module.exports = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
};
