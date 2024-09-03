const authRouter = require("./auth");
const userRouter = require("./user");
const flashcardsRouter = require("./flashcards");

module.exports = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/flashcards", flashcardsRouter);
};
