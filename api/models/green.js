const mongoose = require("mongoose");
const { Schema } = mongoose;

const greenSchema = new Schema(
  {
    dateCreated: {
      type: String,
      required: true
    },
    greens: {
      type: Number,
      min: [0, "Please enter a number greater than 0"],
      max: [18, "Please enter a number less than 19"],
      required: [true, "Please enter a valid number"]
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { collection: "Greens" }
);

const Green = mongoose.model("Green", greenSchema);
module.exports = Green;
