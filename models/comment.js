const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  text: { type: String, required: true, maxLength: 5000 },
  username: { type: String, required: true, maxlength: 50 },
  timestamp: {
    type: String,
    required: true,
    default: new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
