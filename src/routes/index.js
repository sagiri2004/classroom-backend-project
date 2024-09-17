const authRouter = require("./auth");
const userRouter = require("./user");
const flashcardsRouter = require("./flashcards");
const libraryRouter = require("./library");

module.exports = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/flashcards", flashcardsRouter);
  app.use("/api/library", libraryRouter);  
};
