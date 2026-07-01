const express = require('express');
const router = express.Router();

const {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

// Public
router.get('/', getArticles);
router.get('/:slug', getArticle);

// Admin
router.post('/', createArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);

module.exports = router;