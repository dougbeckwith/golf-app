const auth = require("basic-auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const authenticateUser = async (req, res, next) => {
  let user = null;
  let authenticated = false;
  let errors = [];

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  if (!credentials.name) {
    errors.push("Please Enter Email Address");
  }
  if (!credentials.pass) {
    errors.push("Please Enter A Password");
  }

  if (errors.length > 0) {
    res.status(401).send({ errors: errors });
    return;
  }

  if (credentials) {
    user = await User.findOne({ email: credentials.name }).exec();
  }

  if (user) {
    authenticated = bcrypt.compareSync(credentials.pass, user.password);
  } else {
    res.status(401).send({ errors: ["Email or Password Incorrect"] });
    return;
  }

  if (authenticated) {
    user.password = credentials.pass;
    req.currentUser = user;
    next();
  } else {
    res.status(401).send({ errors: ["Email or Password Incorrect"] });
  }
};

module.exports = {
  authenticateUser
};
