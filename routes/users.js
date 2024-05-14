const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../models/user");

/* GET users listing. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const allUsers = await User.find().exec();
    res.json(allUsers);
  })
);

module.exports = router;
