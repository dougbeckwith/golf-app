const mongoose = require("mongoose");
const { Schema } = mongoose;

const goalSchema = new Schema(
  {
    puts: {
      type: Number,
      min: [0, "Please enter a number greater than 0"],
      max: [70, "Please enter a number less than 70"],
      required: [true, "Please enter a valid number"]
    },
    fairways: {
      type: Number,
      min: [0, "Please enter a number greater than 0"],
      max: [100, "Please enter a number less than 100"],
      required: [true, "Please enter a valid number"]
    },
    greens: {
      type: Number,
      min: [0, "Please enter a number greater than 0"],
      max: [100, "Please enter a number less than 100"],
      required: [true, "Please enter a valid number"]
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { collection: "Goals" }
);

const Goal = mongoose.model("Goal", goalSchema);
module.exports = Goal;
