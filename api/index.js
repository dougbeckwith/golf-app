const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const port = 5000;
const clubRoutes = require("./routes/clubRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path");

const connectDataBase = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log("Connected to database");
  } catch (err) {
    console.log(err);
  }
};
connectDataBase();

app.use(cors());
app.use(express.json());
app.use("/clubs", clubRoutes);
app.use("/user", userRoutes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

app.listen(process.env.PORT || port, () => {
  if (process.env.PORT) {
    console.log(`Server listening ${process.env.PORT}`);
    console.log(process.protocol);
  } else {
    console.log(`Server listening ${port}`);
  }
});
