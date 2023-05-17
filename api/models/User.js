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
  { collection: "user-data" }
);

// userSchema.path("email").validate(function (email) {
//   var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//   return emailRegex.test(email.text); // Assuming email has a text attribute
// }, "The e-mail field cannot be empty.");

const User = mongoose.model("User", userSchema);
module.exports = User;
