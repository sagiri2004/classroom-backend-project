const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const routes = require("./routes");
const connectDB = require("./config/connectDB");
const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Chỉ định origin của client (React app)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Cho phép gửi cookie và các thông tin xác thực khác
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

routes(app);
connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
