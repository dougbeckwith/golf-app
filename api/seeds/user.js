const User = require("../models/user");
const { hashPw } = require("../helpers/password");
const { USER_ID } = require("../constants");

const user = { email: "demouser@gmail.com", password: hashPw("password"), _id: USER_ID };

const createUser = async (user) => {
  const newUser = await User.create(user);
  console.log(`User created: ${newUser}`);
};

const deleteUsers = async () => {
  console.log("Deleting users...");
  await User.deleteMany({});
};

module.exports = { user, createUser, deleteUsers };
