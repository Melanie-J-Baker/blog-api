const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, minLength: 6, maxLength: 20 },
});

UserSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

module.exports = mongoose.model("User", UserSchema);
