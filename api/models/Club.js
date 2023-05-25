const mongoose = require("mongoose");
const { Schema } = mongoose;

const clubSchema = new Schema(
  {
    clubName: String,
    brand: String,
    shots: Array,
    totalShots: Number,
    user: { type: mongoose.Types.ObjectId, ref: "User" }
  },
  { collection: "club-data" }
);

const Club = mongoose.model("Club", clubSchema);
module.exports = Club;
