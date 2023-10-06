const Fairway = require("../models/fairway");
const { createDateWithRandomDay, sortByDateCreated } = require("../helpers/dates");
const { randomInt } = require("../helpers/numbers");
const { DEMO_USER_ID } = require("../constants");

const createFairways = async (fairways) => {
  for (let fairway of fairways) {
    try {
      await Fairway.create(fairway);
    } catch (error) {
      throw error;
    }
  }
  console.log("Greens created.");
};

const deleteFairways = async () => {
  console.log("Deleting fairways...");
  await Fairway.deleteMany({});
};

const genereateFairways = (numFairways) => {
  const fairways = [];
  for (let i = 0; i < numFairways; i++) {
    fairways.push({
      fairways: randomInt(40, 70),
      dateCreated: createDateWithRandomDay(),
      user: DEMO_USER_ID
    });
  }

  const sortedData = sortByDateCreated(fairways);

  return sortedData;
};

const fairways = genereateFairways(20);

module.exports = { fairways, deleteFairways, createFairways };
