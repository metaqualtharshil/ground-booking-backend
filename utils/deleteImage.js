const fs = require("fs");
const path = require("path");

// Helper function to delete an image by filename
const deleteImage = (folder, filename) => {
  const filePath = path.join(__dirname, "..", "public", "img", folder, filename);

  // Check if file exists before deleting
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${filePath} - ${err.message}`);
        } else {
          console.log(`✅ File deleted: ${filePath}`);
        }
      });
    }
  });
};

module.exports = deleteImage;
