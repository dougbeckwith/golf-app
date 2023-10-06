const mongoose = require("mongoose");
const { Schema } = mongoose;

const shotSchema = new Schema(
  {
    club: {
      type: Schema.Types.ObjectId,
      ref: "Club"
    },
    totalCarry: {
      type: Number,
      required: true
    },
    totalDistance: {
      type: Number,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { collection: "Shots" }
);

const Shot = mongoose.model("Shot", shotSchema);
module.exports = Shot;
