const User = require("../models/user");
const { hashPw } = require("../helpers/password");

const getUser = async (req, res) => {
  res.status(200).send({ user: req.currentUser });
};

const createUser = async (req, res) => {
  try {
    const hashedPw = hashPw(req.body.password);

    await User.create({
      email: req.body.email,
      password: hashedPw
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
