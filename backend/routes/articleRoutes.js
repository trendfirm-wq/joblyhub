const express = require('express');
const router = express.Router();

const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

// Upload article image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please select an image.',
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'joblyhub/articles',
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            message: error.message,
          });
        }

        res.json({
          image: result.secure_url,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// CRUD Routes
router.get('/', getArticles);

router.get('/:slug', getArticle);

router.post('/', createArticle);

router.put('/:id', updateArticle);

router.delete('/:id', deleteArticle);

module.exports = router;