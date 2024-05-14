const express = require("express");
const router = express.Router();
const passport = require("passport");

// Require contoller modules
const post_controller = require("../controllers/postController");
const comment_controller = require("../controllers/commentController");
const user_controller = require("../controllers/userController");

// USER ROUTES //
// POST request to sign up
router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  user_controller.user_signup_post
);

// POST request to log in
router.post("/login", user_controller.user_login_post);

// GET request for secure route
router.get("/user", (req, res) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
    token: req.query.secret_token,
  });
});

// POST ROUTES //

// POST request for creating a Post
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  post_controller.post_create
);

// DELETE request to delete a Post
router.delete(
  "/posts/:postid",
  passport.authenticate("jwt", { session: false }),
  post_controller.post_delete
);

// PUT request to update a Post
router.put(
  "/posts/:postid",
  passport.authenticate("jwt", { session: false }),
  post_controller.post_update
);

// GET request for one Post
router.get("/posts/:postid", post_controller.post_detail);

// GET request for list of all Posts
router.get("/posts", post_controller.post_list);

// COMMENT ROUTES //

// POST request for creating comment
router.post("/posts/:postid/comments", comment_controller.comment_create);

// DELETE request to delete a comment
router.delete(
  "/posts/:postid/comments/:commentid",
  passport.authenticate("jwt", { session: false }),
  comment_controller.comment_delete
);

// PUT request to update a comment
router.put(
  "/posts/:postid/comments/:commentid",
  passport.authenticate("jwt", { session: false }),
  comment_controller.comment_update
);

// GET request for one comment
router.get(
  "/posts/:postid/comments/:commentid",
  comment_controller.comment_detail
);

// GET request for all comments on a post
router.get("/posts/:postid/comments", comment_controller.comments_list);

module.exports = router;
