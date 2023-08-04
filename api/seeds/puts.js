const Put = require("../models/put");
const { createDateWithRandomDay } = require("../helpers/dates");
const { randomInt } = require("../helpers/numbers");
const { DEMO_USER_ID } = require("../constants");

const createPuts = async (puts) => {
  for (let put of puts) {
    try {
      await Put.create(put);
    } catch (error) {
      throw error;
    }
  }
  console.log("Puts created.");
};

const deletePuts = async () => {
  console.log("Deleting puts...");
  await Put.deleteMany({});
};

const generatePuts = (numPuts) => {
  const puts = [];
  for (let i = 0; i < numPuts; i++) {
    puts.push({
      puts: randomInt(24, 39),
      dateCreated: createDateWithRandomDay(),
      user: DEMO_USER_ID
    });
  }
  return puts;
};

const puts = generatePuts(20);

module.exports = { puts, deletePuts, createPuts };
