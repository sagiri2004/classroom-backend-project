const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const routes = require("./routes");
const connectDB = require("./config/connectDB");
const app = express();

const allowedOrigins = [
  "https://classroom-project-frontend-6uar.vercel.app",
  "https://nguyenthang2k4dev.id.vn/",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Cho phép gửi cookie và các thông tin xác thực khác
};

module.exports = corsOptions;

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

routes(app);
connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
