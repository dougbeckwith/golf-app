const Club = require("../models/club");
const { USER_ID } = require("../constants");

const addShotsToClub = async (club, shots) => {
  try {
    for (let item of shots) {
      if (club.shots) club.shots = [...club.shots, item._id];
      else club.shots = [item._id];
      await Club.updateOne({ name: club.name }, { club });
    }
  } catch (error) {
    throw error;
  }
};

const createClubs = async (clubs) => {
  for (let club of clubs) {
    try {
      await Club.create(club);
    } catch (error) {
      throw error;
    }
  }
  console.log("Clubs created.");
};

const deleteClubs = async () => {
  console.log("Deleting clubs...");
  await Club.deleteMany({});
};

const clubs = [
  {
    name: "Driver",
    brand: "Callaway",
    user: USER_ID
  },
  {
    name: "3 Wood",
    brand: "Callaway",
    user: USER_ID
  }
];

module.exports = { clubs, addShotsToClub, deleteClubs, createClubs };
