const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(url);
    console.log("Database connected!");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  connectDB
};
