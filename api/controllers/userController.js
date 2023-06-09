const User = require("../models/User");
const bcrypt = require("bcrypt");

const getUser = async (req, res) => {
  console.log("GET USER");
  res.status(200).send({ user: req.currentUser });
};

const createUser = async (req, res) => {
  console.log("CREATE USER");
  try {
    const myPlaintextPassword = req.body.password;
    const saltRounds = 10;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(myPlaintextPassword, salt);

    await User.create({
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
