const homeRouter = require("./home");
const apiRouter = require("./api");

module.exports = (app) => {
  app.use("/api", apiRouter);
  app.use("/", homeRouter);
};

