const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 5000;

const clubRoutes = require("./routes/clubRoutes");
const userRoutes = require("./routes/userRoutes");
const putRoutes = require("./routes/putRoutes");

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

app.get("/", (req, res) => {
  console.log("Route To Wake Up Server");
  res.status(200).end();
});

app.use("/clubs", clubRoutes);
app.use("/user", userRoutes);
app.use("/puts", putRoutes);

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
  } else {
    console.log(`Server listening ${port}`);
  }
});
