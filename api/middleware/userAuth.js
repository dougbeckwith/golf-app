const auth = require("basic-auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const AppError = require("../helpers/AppError");

// Basic Auth
const authenticateUser = async (req, res, next) => {
  let user = null;
  let authenticated = false;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  if (!credentials) {
    return next(new AppError("No Credentials Found", 400));
  }
  if (!credentials.name) {
    return next(new AppError("Please Enter Email Address", 400));
  }
  if (!credentials.pass) {
    return next(new AppError("Please Enter Password", 400));
  }
  if (credentials) {
    user = await User.findOne({ email: credentials.name }).exec();
  }

  if (user) {
    authenticated = bcrypt.compareSync(credentials.pass, user.password);
  } else {
    return next(new AppError("Email or Password Incorrect", 401));
  }

  if (authenticated) {
    user.password = credentials.pass;
    req.currentUser = user;
    next();
  } else {
    return next(new AppError("Email or Password Incorrect", 401));
  }
};

module.exports = {
  authenticateUser
};
