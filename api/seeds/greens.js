const Green = require("../models/green");
const { createDateWithRandomDay } = require("../helpers/dates");
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
  console.log("Deleting puts...");
  await Green.deleteMany({});
};

const generateGreens = (numGreens) => {
  const greens = [];
  for (let i = 0; i < numGreens; i++) {
    greens.push({
      greens: randomInt(5, 12),
      dateCreated: createDateWithRandomDay(),
      user: DEMO_USER_ID
    });
  }

  function sortByDateCreated(arr) {
    arr.sort((a, b) => {
      const dateA = a.dateCreated;
      const dateB = b.dateCreated;
      return dateA.localeCompare(dateB);
    });
    return arr;
  }

  const sortedData = sortByDateCreated(greens);
  console.log(sortedData, "hmm");

  // const sortedGreens = clubsWithAverageYards.sort(function (a, b) {
  //   return b.averageDistance - a.averageDistance;
  // });

  // return sortedGreens;
  return sortedData;
};

const greens = generateGreens(20);

module.exports = { greens, deleteGreens, createGreens };
