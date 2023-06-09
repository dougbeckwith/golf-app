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
    // future mabey look at seperating shots into a seperate schema/model and associate club with a list of shots.
    // Then we could seperate end points to just delete shot instead of updating a club
    shots: {
      // Array Of Objects: [{totalDistance:Number, totalCarry:Number, shotId: Number}]
      type: Array
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
