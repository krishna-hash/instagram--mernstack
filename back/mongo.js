const mongoose = require("mongoose");
const instance = mongoose.Schema({
  user: String,
  caption: String,
  image: String,
  comment: [],
});
module.exports = mongoose.model("instadb", instance);
