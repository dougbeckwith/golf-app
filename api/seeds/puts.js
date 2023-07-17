const { USER_ID } = require("../constants");
const { createDateWithRandomDay } = require("../helpers/dates");
const { randomInt } = require("../helpers/randomNumbers");

const createPuts = (numPuts) => {
  const puts = [];
  for (let i = 0; i < numPuts; i++) {
    puts.push({
      puts: randomInt(24, 49),
      dateCreated: createDateWithRandomDay(),
      user: USER_ID
    });
  }
  return puts;
};

const puts = createPuts(100);

module.exports = [...puts];
