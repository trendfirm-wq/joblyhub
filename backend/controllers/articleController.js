const Article = require('../models/Article');

// Create Article
exports.createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);

    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get All Published Articles
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      status: 'published',
    }).sort({
      publishedAt: -1,
    });

    res.json(articles);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get One Article by Slug
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
    });

    if (!article) {
      return res.status(404).json({
        message: 'Article not found',
      });
    }

    article.views += 1;
    await article.save();

    res.json(article);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Article
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(article);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Article
exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Article deleted',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};