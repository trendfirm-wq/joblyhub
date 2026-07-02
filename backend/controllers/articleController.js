const Article = require('../models/Article');
const slugify = require('slugify');
// Create Article
exports.createArticle = async (req, res) => {
   console.log(req.body);
  try {
    let slug = slugify(req.body.title, {
      lower: true,
      strict: true,
    });

    const existing = await Article.findOne({ slug });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

  const article = await Article.create({
  title: req.body.title,
  slug,
  excerpt: req.body.excerpt,
  blocks: req.body.blocks || [],
  coverImage: req.body.coverImage,
  category: req.body.category,
  status: req.body.status || "draft",
  author: "JoblyHub",
  publishedAt:
    req.body.status === "published"
      ? new Date()
      : null,
});

    res.status(201).json(article);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });

  }
};
// Get All Published Articles
// Get Articles
exports.getArticles = async (req, res) => {
  try {

    const status = req.query.status;

    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    const sort =
      status === "published"
        ? { publishedAt: -1 }
        : { updatedAt: -1 };

    const articles = await Article.find(filter).sort(sort);

    res.json(articles);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};
// Get Article By ID
exports.getArticleById = async (req, res) => {
  try {

    const article = await Article.findById(
      req.params.id
    );

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.json(article);

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
// Update Article
exports.updateArticle = async (req, res) => {
  try {

    const article = await Article.findById(
      req.params.id
    );

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    article.title = req.body.title;
    article.excerpt = req.body.excerpt;
    article.category = req.body.category;
    article.coverImage = req.body.coverImage;
    article.blocks = req.body.blocks;
    article.status = req.body.status;

    if (
      req.body.status === "published" &&
      !article.publishedAt
    ) {
      article.publishedAt = new Date();
    }

    await article.save();

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