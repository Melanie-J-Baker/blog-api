const Post = require("../models/post");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// GET list of all Posts
exports.post_list = asyncHandler(async (req, res, next) => {
  const { title, text, timestamp, published, comments } = req.query;
  const allPosts = await Post.find().sort({ timestamp: -1 }).exec();
  let results = [...allPosts];
  if (title) {
    results = results.filter((r) => r.title === title);
  }
  if (text) {
    results = results.filter((r) => r.text === text);
  }
  if (timestamp) {
    results = results.filter((r) => r.timestamp === timestamp);
  }
  if (published) {
    results = results.filter((r) => r.published === published);
  }
  if (comments) {
    results = results.filter((r) => r.comments === comments);
  }
  res.json(results);
});

// GET details of a specific Post
exports.post_detail = asyncHandler(async (req, res, next) => {
  // Get details of post and comments (in parallel)
  const [post, allCommentsOnPost] = await Promise.all([
    Post.findById(req.params.postid).exec(),
    Comment.find({ post: req.params.postid }, "text username timestamp")
      .sort({ timestamp: -1 })
      .exec(),
  ]);
  if (post === null) {
    // No results
    return res.status(404).json({ error: "Post not found" });
  }
  post.comments = [allCommentsOnPost];
  res.json(post);
});

// POST request to create a Post
exports.post_create = [
  // Validate and sanitize fields
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Title must be specified."),
  body("text")
    .trim()
    .isLength({ min: 1, max: 5000 })
    .escape()
    .withMessage("Post is empty!"),
  body("published").isBoolean(),
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);
    // Create Post object with escaped and trimmed data
    const post = new Post({
      title: req.body.title,
      text: req.body.text,
      timestamp: new Date().toLocaleString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      published: req.body.published,
      comments: [],
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    } else {
      // Data is valid - save Post
      await post.save();
      res.json(post);
    }
  }),
];

// DELETE Post
exports.post_delete = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postid).exec();
    if (!post) {
      return res
        .status(404)
        .json({ err: `Post with id ${req.params.postid} not found` });
    }
    // Get details of Post's comments
    const allCommentsOnPost = await Comment.find({
      post: req.params.postid,
    }).exec();
    if (allCommentsOnPost.length > 0) {
      for (let comment in allCommentsOnPost) {
        await Comment.findByIdAndDelete(comment._id).exec();
      }
    }
    await Post.findByIdAndDelete(req.params.postid).exec();
    res.status(200).json({ postdeleted: req.params.postid });
  } catch (err) {
    next(err);
  }
});

// PUT Post update
exports.post_update = [
  // Validate and sanitize fields
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Title must be specified."),
  body("text")
    .trim()
    .isLength({ min: 1, max: 5000 })
    .escape()
    .withMessage("Post is empty!"),
  body("published").isBoolean(),
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);
    // Create Post object with escaped and trimmed data
    const post = new Post({
      title: req.body.title,
      text: req.body.text,
      timestamp: new Date().toLocaleString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      published: req.body.published,
      comments: [],
      _id: req.params.postid,
    });
    if (!errors.isEmpty()) {
      res.json(errors.array());
      return res.status(400).json({ error: "Post update data is not valid" });
    } else {
      // Data is valid update Post
      await Post.findByIdAndUpdate(req.params.postid, post);
      res.json(post);
    }
  }),
];
