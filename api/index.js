const express = require("express");
const app = express();
const morgan = require("morgan");
const AppError = require("./helpers/AppError");

const cors = require("cors");
const path = require("path");

const clubRoutes = require("./routes/clubRoutes");
const userRoutes = require("./routes/userRoutes");
const putRoutes = require("./routes/putRoutes");
const shotRoutes = require("./routes/shotRoutes");

const { connectDB } = require("./helpers/database");
const { DB_DEV_URL } = require("./constants");

const dbUrl = process.env.MONGO_URL || DB_DEV_URL;
connectDB(dbUrl);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/clubs", clubRoutes);
app.use("/user", userRoutes);
app.use("/puts", putRoutes);
app.use("/clubs/:id/shots", shotRoutes);

const handleValidationError = () => {
  return new AppError("Validation Failed", 400);
};

const handleCastError = () => {
  return new AppError("Cast Error", 400);
};

// app.use("*", (req, res, next) => {
//   next(new AppError("Page Not Found", 404));
// });

app.use((err, req, res, next) => {
  console.dir(err);
  next(err);
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") err = handleValidationError();
  if (err.name === "CastError") err = handleCastError();
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(status);
});

// app.use((req, res) => {
//   res.status(404).json({
//     message: "Route Not Found"
//   });
// });

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
