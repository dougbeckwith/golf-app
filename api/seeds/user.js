const { USER_ID } = require("../constants");
const { hashPw } = require("../helpers/password");

module.exports = {
  email: "demouser@gmail.com",
  password: hashPw("password"),
  _id: USER_ID
};
