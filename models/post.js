const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  text: { type: String, required: true, maxLength: 5000 },
  timestamp: {
    type: String,
    required: true,
    default: new Date().toLocaleString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
  published: { type: Boolean, required: true, default: false },
  comments: { type: Array, required: false, default: [] },
});

// Virtual for post's URL (declaring URLs as virtual in schema good idea as URL then only needs to get changed in one place
PostSchema.virtual("url").get(function () {
  // Don't use an arrow fn as we'll need the this obj
  return `/posts/${this._id}`;
});
module.exports = mongoose.model("Post", PostSchema);
