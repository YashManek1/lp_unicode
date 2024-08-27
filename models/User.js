const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
