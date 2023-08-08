const mongoose = require("mongoose");
const { Schema } = mongoose;

const fairwaySchema = new Schema(
  {
    dateCreated: {
      type: String,
      required: true
    },
    fairways: {
      type: Number,
      min: [0, "Please enter a number greater than 0"],
      max: [100, "Please enter a number less than 19"],
      required: [true, "Please enter a valid number"]
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { collection: "Fairways" }
);

const Fairway = mongoose.model("Fairway", fairwaySchema);
module.exports = Fairway;
