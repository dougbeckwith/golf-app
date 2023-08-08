const Green = require("../models/green");
const { createDateWithRandomDay, sortByDateCreated } = require("../helpers/dates");
const { randomInt } = require("../helpers/numbers");
const { DEMO_USER_ID } = require("../constants");

const createGreens = async (greens) => {
  for (let green of greens) {
    try {
      await Green.create(green);
    } catch (error) {
      throw error;
    }
  }
  console.log("Greens created.");
};

const deleteGreens = async () => {
  console.log("Deleting greens...");
  await Green.deleteMany({});
};

const generateGreens = (numGreens) => {
  const greens = [];
  for (let i = 0; i < numGreens; i++) {
    greens.push({
      greens: randomInt(40, 60),
      dateCreated: createDateWithRandomDay(),
      user: DEMO_USER_ID
    });
  }

  const sortedData = sortByDateCreated(greens);

  return sortedData;
};

const greens = generateGreens(20);

module.exports = { greens, deleteGreens, createGreens };
