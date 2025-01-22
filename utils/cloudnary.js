const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Create Cloudinary storage with resizing logic
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'grounds', // Folder name in your Cloudinary account
    format: async () => 'jpeg', // Convert images to JPEG format
    allowed_formats: ['jpeg', 'png', 'jpg'], // Allowed file formats
    transformation: [
      { width: 800, height: 800, crop: 'limit' }, // Resize with max width 800px and height 600px
    ],
  },
});

const upload = multer({ storage });

module.exports = upload;
