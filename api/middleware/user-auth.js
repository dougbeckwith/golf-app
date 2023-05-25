const auth = require("basic-auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const authenticateUser = async (req, res, next) => {
  let user = null;
  let authenticated = false;
  let errors = [];

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  // check for email and password
  if (!credentials.name) {
    errors.push("Please Enter Email Address");
  }
  if (!credentials.pass) {
    errors.push("Please Enter A Password");
  }

  // return if errors with credentials
  if (errors.length > 0) {
    res.status(401).json({ errors: errors });
    return;
  }

  // check for user in database
  if (credentials) {
    user = await User.findOne({ email: credentials.name }).exec();
  }

  // if user use bycript to confirm password matches
  // else send error message
  if (user) {
    authenticated = bcrypt.compareSync(credentials.pass, user.password);
  } else {
    res.status(401).json({ errors: ["Email or Password Incorrect"] });
    return;
  }

  // if authenticated set currentUser to req object
  // else send error message
  if (authenticated) {
    user.password = credentials.pass;
    req.currentUser = user;
    next();
  } else {
    res.status(401).json({ errors: ["Email or Password Incorrect"] });
  }
};

module.exports = {
  authenticateUser
};
