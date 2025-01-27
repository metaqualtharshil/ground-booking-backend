const path = require('path');
const fs = require('fs');

// Helper function to delete an image by filename
const deleteImage = (folder,filename) => {
  const filePath = path.join(__dirname, '..', 'public', 'img', folder, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${filePath}`);
    } else {
      console.log(`File deleted: ${filePath}`);
    }
  });
};

module.exports = deleteImage;
