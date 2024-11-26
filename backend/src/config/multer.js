const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationPath;

    if (file.mimetype.startsWith('image/')) {
      destinationPath = '../../uploads/images';
    } else if (
      file.mimetype === 'application.pdf' ||
      file.mimetype === 'application/msword'
    ) {
      destinationPath = '../../uploads/documents';
    } else {
      return cb(
        new Error(
          'Invalid file type. Only images, PDFs, and Word documents ara allowed'
        ),
        null
      );
    }

    cb(null, path.join(__dirname, destinationPath));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });
module.exports = upload;

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Specify the destination directory based on the file type
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, path.join(__dirname, '../../uploads/images'));
//     } else if (
//       file.mimetype === 'application/pdf' ||
//       file.mimetype === 'application/msword'
//     ) {
//       cb(null, path.join(__dirname, '../../uploads/documents'));
//     } else {
//       cb(new Error('Invalid file type'), null);
//     }
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = crypto.randomBytes(8).toString('hex');
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });
// module.exports = upload;
