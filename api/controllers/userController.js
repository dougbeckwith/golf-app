const User = require("../models/User");
const bcrypt = require("bcrypt");

// GET a User
const getUser = async (req, res) => {
  try {
    res.status(200).send({ user: req.currentUser });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
};

// CREATE new user
const createUser = async (req, res) => {
  try {
    console.log("req.body", req.body);

    const myPlaintextPassword = req.body.password;
    const saltRounds = 10;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(myPlaintextPassword, salt);

    const user = await User.create({
      email: req.body.email,
      password: hash
    });

    res.status(201).end();
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.status(400).send({ error: ["User Email already exists"] });
    } else {
      res.status(400).send({ error: [error.message] });
    }
  }
};

module.exports = {
  createUser,
  getUser
};
