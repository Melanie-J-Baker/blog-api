const Post = require("../models/post");
const Comment = require("../models/comment");
//const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// GET list of all Comments
exports.comments_list = asyncHandler(async (req, res, next) => {
  const { post, text, username, timestamp } = req.query;
  const allComments = await Comment.find().sort({ timestamp: -1 }).exec();
  let results = [...allComments];
  if (post) {
    results = results.filter((r) => r.post === post);
  }
  if (text) {
    results = results.filter((r) => r.text === text);
  }
  if (username) {
    results = results.filter((r) => r.username === username);
  }
  if (timestamp) {
    results = results.filter((r) => r.timestamp === timestamp);
  }
  res.json(results);
});

// GET details of a specific Comment
exports.comment_detail = asyncHandler(async (req, res, next) => {
  // Get details of post and comment (in parallel)
  const [post, comment] = await Promise.all([
    Post.findById(req.params.postid).exec(),
    Comment.findById(req.params.commentid).exec(),
  ]);
  if (comment === null) {
    // No results
    return res.status(404).json({ error: "Comment not found" });
  }
  comment.post = post;
  res.json(comment);
});

// POST Comment create
exports.comment_create = [
  // Validate and sanitize fields
  body("text")
    .trim()
    .isLength({ min: 1, max: 5000 })
    .escape()
    .withMessage("Post is empty!"),
  body("username")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape()
    .withMessage("Username is required"),
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);
    // Create Comment object with escaped and trimmed data
    const comment = new Comment({
      post: req.params.postid,
      text: req.body.text,
      username: req.body.username,
      timestamp: Date.now(),
    });
    if (!errors.isEmpty()) {
      res.json(errors.array());
      return res
        .status(400)
        .json({ error: "Comment create data is not valid" });
    } else {
      // Data is valid
      // Save Comment
      await comment.save();
      res.json(comment);
    }
  }),
];

// DELETE Comment
exports.comment_delete = asyncHandler(async (req, res, next) => {
  // Delete Comment
  await Comment.findByIdAndDelete(req.params.commentid);
  res.json({ commentdeleted: req.params.commentid });
});

// PUT Comment update
exports.comment_update = [
  // Validate and sanitize fields
  body("text")
    .trim()
    .isLength({ min: 1, max: 5000 })
    .escape()
    .withMessage("Post is empty!"),
  body("username")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape()
    .withMessage("Username is required"),
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);
    // Create Comment object with escaped and trimmed data
    const comment = new Comment({
      post: req.body.postid,
      text: req.body.text,
      username: req.body.username,
      timestamp: Date.now(),
      _id: req.params.commentid,
    });
    if (!errors.isEmpty()) {
      res.json(errors.array());
      return res
        .status(400)
        .json({ error: "Comment update data is not valid" });
    } else {
      // Data is valid update Comment
      await Comment.findByIdAndUpdate(req.params.commentid, comment);
      res.json(comment);
    }
  }),
];
