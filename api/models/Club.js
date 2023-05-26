const mongoose = require("mongoose");
const { Schema } = mongoose;

const clubSchema = new Schema(
  {
    club: {
      type: String,
      required: [true, "Club is required"]
    },
    brand: {
      type: String,
      required: [true, "Brand is required"]
    },
    shots: {
      type: Array // [{totalDistance:Number, totalCarry:Number, shotId: Number}]
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  { collection: "Clubs" }
);

const Club = mongoose.model("Club", clubSchema);
module.exports = Club;
