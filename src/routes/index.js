const authRouter = require("./auth");
const userRouter = require("./user");
const flashcardsRouter = require("./flashcards");
const libraryRouter = require("./library");
const siteRouter = require("./site");

module.exports = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/flashcards", flashcardsRouter);
  app.use("/api/library", libraryRouter);
  app.use("/api/site", siteRouter);
};
