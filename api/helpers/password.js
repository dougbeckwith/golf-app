const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../constants");

const hashPw = (password) => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hashedPw = bcrypt.hashSync(password, salt);
  return hashedPw;
};

module.exports = {
  hashPw
};
