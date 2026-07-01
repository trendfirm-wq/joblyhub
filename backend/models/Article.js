const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
    },

   blocks: [
  {
    id: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
],
    coverImage: {
      type: String,
      default: '',
    },

    category: {
      type: String,
      default: 'Career',
    },

    author: {
      type: String,
      default: 'JoblyHub',
    },

    tags: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },

    seoTitle: {
      type: String,
      default: '',
    },

    seoDescription: {
      type: String,
      default: '',
    },

    views: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    publishedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Article', articleSchema);