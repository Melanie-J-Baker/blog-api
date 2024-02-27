const jwt = require("jsonwebtoken");
const passport = require("passport");
const asyncHandler = require("express-async-handler");

// Sign Up User on POST
exports.user_signup_post = asyncHandler(async (req, res, next) => {
  res.json({
    message: "Sign up successful",
    user: req.user,
  });
});

// Handle User login on POST
exports.user_login_post = asyncHandler(async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred");
        return next(error);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = { _id: user._id, username: user.username };
        const token = jwt.sign({ user: body }, "TOP_SECRET");
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});
