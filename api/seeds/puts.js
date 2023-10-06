const Put = require("../models/put");
const { createDateWithRandomDay, sortByDateCreated } = require("../helpers/dates");
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
      puts: randomInt(34, 42),
      dateCreated: createDateWithRandomDay(),
      user: DEMO_USER_ID
    });
  }

  const sortedData = sortByDateCreated(puts);

  return sortedData;
};

const puts = generatePuts(20);

module.exports = { puts, deletePuts, createPuts };
