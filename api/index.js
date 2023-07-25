const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const clubRoutes = require("./routes/clubs");
const userRoutes = require("./routes/users");
const putRoutes = require("./routes/puts");
const shotRoutes = require("./routes/shots");
const { connectDB } = require("./helpers/database");
const { DB_DEV_URL } = require("./constants");
const { handleCastError, handleValidationError } = require("./helpers/errors");
const AppError = require("./helpers/AppError");

const dbUrl = process.env.MONGO_URL || DB_DEV_URL;
connectDB(dbUrl);

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/client/build")));

app.use("/clubs", clubRoutes);
app.use("/user", userRoutes);
app.use("/puts", putRoutes);
app.use("/clubs/:id/shots", shotRoutes);

// app.use("*", (req, res, next) => {
//   next(new AppError("Bad Reqeust", 400));
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

app.use((err, req, res, next) => {
  console.log("Error Logger:");
  console.dir(err);
  next(err);
});

app.use((err, req, res, next) => {
  console.log("Error.name:", err.name);
  console.log("Error.message", err.message);
  if (err.name === "ValidationError") err = handleValidationError();
  if (err.name === "CastError") err = handleCastError();
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(status).json({ err });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
