const User = require("../models/User");

// GET a User
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// CREATE new user
const createUser = async (req, res) => {
  try {
    // hash password before storing password uising bcrypt
    const user = await User.create(req.body);
    res.status(201).end();
  } catch {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  createUser,
  getUser
};
