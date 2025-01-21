const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dz4kbwmxk',
  api_key: '635999668677418',
  api_secret: '3H_KbzNGm65xkH8WySwZ4t5qIgU',
});

// Create Cloudinary storage with resizing logic
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'grounds', // Folder name in your Cloudinary account
    format: async () => 'jpeg', // Convert images to JPEG format
    transformation: [
      { width: 800, height: 600, crop: 'limit' }, // Resize with max width 800px and height 600px
    ],
  },
});

const upload = multer({ storage });

module.exports = upload;
