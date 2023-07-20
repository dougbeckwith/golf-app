const User = require("../models/user");
const { hashPw } = require("../helpers/password");
const { DEMO_USER_ID } = require("../constants");

const user = { email: "demouser@gmail.com", password: hashPw("password"), _id: DEMO_USER_ID };

const createUser = async (user) => {
  const demoUser = await User.create(user);
  console.log(`User created: ${demoUser}`);
};

const deleteUsers = async () => {
  console.log("Deleting users...");
  await User.deleteMany({});
};

module.exports = { user, createUser, deleteUsers };
