const mongoose = require("mongoose");
const { Schema } = mongoose;

const shotSchema = new Schema(
  {
    totalDistance: {
      type: Number,
      required: true
    },
    totalCarry: {
      type: Number,
      required: true
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: "Club"
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
