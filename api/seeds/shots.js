const Shot = require("../models/shot");
const Club = require("../models/club");
const { USER_ID } = require("../constants");
const { addShotsToClub } = require("./clubs");

const associateShotsToClubs = async () => {
  try {
    const clubs = await Club.find({});
    const shots = await Shot.find({});
    for (let item of clubs) {
      const club = await Club.findOne({ name: item.name });
      await addShotsToClub(club, shots);
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
      if (i > 5) {
        distance = distance - 12;
      } else {
        distance = distance - 25;
      }
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
  let totalCarry = distance - 15;
  const shots = [];

  for (let i = 0; i < numShots; i++) {
    shots.push({
      totalDistance,
      totalCarry
    });
  }
  return shots;
};

module.exports = { deleteShots, createShots, associateShotsToClubs };
