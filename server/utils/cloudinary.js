const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage steup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lms_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi'],
    resource_type: 'auto', // video image auto ditection
    max_file_size: 50000000 // 50MB limit
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };