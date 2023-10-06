const mongoose = require("mongoose");
const { Schema } = mongoose;

const clubSchema = new Schema(
  {
    brand: {
      type: String,
      required: [true, "Brand is required"]
    },
    name: {
      type: String,
      required: [true, "Club is required"]
    },
    shots: [
      {
        type: Schema.Types.ObjectId,
        ref: "Shot"
      }
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { collection: "Clubs" }
);

const Club = mongoose.model("Club", clubSchema);
module.exports = Club;
