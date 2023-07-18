const Shot = require("../models/shot");
const { USER_ID } = require("../constants");
const { addShotsToClub } = require("./clubs");

const associateShotsToClubs = async (clubs) => {
  try {
    const shots = await Shot.find({});
    for (let club of clubs) {
      addShotsToClub(club, shots);
    }
  } catch (error) {
    throw error;
  }
};

const createShots = async (clubs) => {
  let distance = 300;
  try {
    for (let i = 0; i < clubs.length; i++) {
      const generatedShots = generateShots(5, distance);
      await Shot.create({ shots: generatedShots, user: USER_ID });
      distance = distance - 15;
    }
  } catch (error) {
    throw error;
  }
};

const deleteShots = async () => {
  console.log("Deleting shots");
  await Shot.deleteMany({});
};

const generateShots = (numShots, distance) => {
  let totalDistance = distance;
  let totalCarry = distance - 20;
  const shots = [];

  for (let i = 0; i < numShots; i++) {
    shots.push({
      totalDistance,
      totalCarry
    });
    totalDistance = totalDistance - 20;
    totalCarry = totalCarry - 20;
  }
  return shots;
};

module.exports = { deleteShots, createShots, associateShotsToClubs };
