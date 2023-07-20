const User = require("../models/user");
const { hashPw } = require("../helpers/password");

const createUser = async (req, res, next) => {
  try {
    const hashedPw = hashPw(req.body.password);

    await User.create({ email: req.body.email, password: hashedPw });

    res.status(201).end();
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res) => {
  res.status(200).send({ user: req.currentUser });
};

module.exports = {
  createUser,
  getUser
};
