const mongoose = require("mongoose");
const { Schema } = mongoose;

const putSchema = new Schema(
  {
    puts: {
      type: Number,
      min: [1, "Please enter a number greater than 1"],
      max: [70, "Please enter a number less than 70"],
      required: [true, "Please enter a valid number"]
    },
    dateCreated: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  { collection: "Puts" }
);

const Put = mongoose.model("Put", putSchema);
module.exports = Put;
