const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const clubRoutes = require("./routes/clubRoutes");
const userRoutes = require("./routes/userRoutes");
const putRoutes = require("./routes/putRoutes");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const dbUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/golf-app";
const connectDataBase = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(dbUrl);
    console.log("Database connected");
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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
