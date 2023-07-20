const Shot = require("../models/shot");
const Club = require("../models/club");
const { DEMO_USER_ID } = require("../constants");
const { addShotsToClub } = require("./clubs");
const { randomInt } = require("../helpers/numbers");

// loop over clubs
// update each club to include 5 shots
const associateShotsToClubs = async () => {
  try {
    let shotIndex = 0;
    const clubs = await Club.find({});
    const shots = await Shot.find({});
    for (let item of clubs) {
      const club = await Club.findOne({ name: item.name });
      await addShotsToClub(club, shots, shotIndex);
      shotIndex = shotIndex + 5;
    }
  } catch (error) {
    throw error;
  }
};

// create 5 shots for each club
// every 5 shots created remove some yardage
// for the following 5 shots
const createShots = async () => {
  let baseDistance = 300;
  try {
    const clubs = await Club.find();
    for (let i = 0; i < clubs.length; i++) {
      const generatedShots = generateShots(5, baseDistance);
      for (let j = 0; j < generatedShots.length; j++) {
        const { totalCarry, totalDistance } = generatedShots[j];
        await Shot.create({ totalCarry, totalDistance, user: DEMO_USER_ID, club: clubs[i]._id });
      }
      if (i > 5) {
        baseDistance = baseDistance - 12;
      } else {
        baseDistance = baseDistance - 25;
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

const generateShots = (numShots, baseDistance) => {
  let totalDistance = baseDistance;
  let totalCarry = totalDistance - 15;
  const shots = [];

  for (let i = 0; i < numShots; i++) {
    shots.push({
      totalDistance: totalDistance - randomInt(1, 7),
      totalCarry: totalCarry - randomInt(1, 7)
    });
  }
  return shots;
};

module.exports = { deleteShots, createShots, associateShotsToClubs };
