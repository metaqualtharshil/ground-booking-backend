// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// // Create Cloudinary storage with resizing logic
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'grounds',
//     allowed_formats: ['jpeg', 'png', 'jpg'],
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;


// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// // Function to create Cloudinary storage dynamically
// const createCloudinaryStorage = (folder, width = 800, height = 800) =>
//   new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder, // Dynamic folder name
//       format: async () => 'jpeg', // Default format
//       allowed_formats: ['jpeg', 'png', 'jpg'], // Allowed formats
//       transformation: [
//         { width, height, crop: 'limit' }, // Resize with dynamic dimensions
//       ],
//     },
//   });

// // Multer setup for dynamic storage
// const getUploader = (folder, width, height) => {
//   const storage = createCloudinaryStorage(folder, width, height);
//   return multer({ storage });
// };

// // Exporting dynamic uploader function
// module.exports = {
//   getUploader,
// };
