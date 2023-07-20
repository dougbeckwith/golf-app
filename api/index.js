const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const clubRoutes = require("./routes/clubRoutes");
const userRoutes = require("./routes/userRoutes");
const putRoutes = require("./routes/putRoutes");
const shotRoutes = require("./routes/shotRoutes");
const { connectDB } = require("./helpers/database");
const { DB_DEV_URL } = require("./constants");
const { handleCastError, handleValidationError } = require("./helpers/errors");
const AppError = require("./helpers/AppError");

const dbUrl = process.env.MONGO_URL || DB_DEV_URL;
connectDB(dbUrl);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/clubs", clubRoutes);
app.use("/user", userRoutes);
app.use("/puts", putRoutes);
app.use("/clubs/:id/shots", shotRoutes);

app.use("*", (req, res, next) => {
  console.log("* Page not found error");
  next(new AppError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  console.log("Error Logger:");
  console.dir(err);
  next(err);
});

app.use((err, req, res, next) => {
  console.log("Error.name:", err.name);
  console.log("Error.mesage", err.message);
  if (err.name === "ValidationError") err = handleValidationError();
  if (err.name === "CastError") err = handleCastError();
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(status).json({ serverError: err });
});

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
