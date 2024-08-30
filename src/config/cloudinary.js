// ENV
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    // dinh dang png hoac jpg
    format: async (req, file) => "jpg",
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});


const upload = multer({ storage: storage });

module.exports = upload;
