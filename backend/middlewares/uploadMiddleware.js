const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  // Set the destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  // Set the filename with a unique timestamp to avoid conflicts
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp') {
    cb(null, true); // Accept the file
  } else {
    // Reject the file and return an error
    cb(new Error('Only JPG, PNG, or WebP images are allowed'));
  }
};

// Create the upload middleware with the storage and file filter settings
const upload = multer({ storage, fileFilter });

module.exports = upload;
