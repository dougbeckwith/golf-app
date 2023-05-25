const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { collection: "user-data" },
  { strict: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
