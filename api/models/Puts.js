const mongoose = require("mongoose");
const { Schema } = mongoose;

const putSchema = new Schema(
  {
    puts: {
      type: Number,
      required: true
    },
    dateCreated: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  { collection: "Puts" }
);

const Puts = mongoose.model("Puts", putSchema);
module.exports = Puts;
