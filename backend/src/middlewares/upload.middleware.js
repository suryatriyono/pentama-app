const multer = require('multer');
const sharp = require('sharp');

const imageUpload = multer({
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png)$/)) {
      return cb(new Error('Only PNG image are allowed.'), false);
    }
    cb(null, true);
  },
});

const validateTransparentImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('File is required');
    }

    // Only check PNG format because JPEG format not supported transparency
    if (req.file.mimetype === 'image/png') {
      const imageBuffer = req.file.buffer;
      const image = sharp(imageBuffer);

      // Get metadata information
      const metadata = await image.metadata();

      // Check whether image have alpha channel
      if (!metadata.hasAlpha) {
        throw new Error('Image must have a transparent background');
      }

      next(); // if validation successful, continue to next middleware
    }
  } catch (error) {
    next(error); // Throw error to be handled by the error handler
  }
};

const documentUpload = multer({
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|doc)$/)) {
      return cb(new Error('Only PDF adn DOC document are allowed.'), false);
    }
    cb(null, true);
  },
});

module.exports = { imageUpload, validateTransparentImage, documentUpload };
