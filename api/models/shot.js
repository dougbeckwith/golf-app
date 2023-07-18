const mongoose = require("mongoose");
const { Schema } = mongoose;

const shotSchema = new Schema({
  totalDistance: {
    type: Number,
    required: true
  },
  totalCarry: {
    type: Number,
    required: true
  }
});

const shotsSchema = new Schema(
  {
    shots: {
      type: [shotSchema],
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { collection: "Shots" }
);

const Shot = mongoose.model("Shot", shotsSchema);
module.exports = Shot;
