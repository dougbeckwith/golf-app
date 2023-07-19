const Club = require("../models/club");
const { USER_ID } = require("../constants");

const addShotsToClub = async (club, shots) => {
  console.log(club);
  console.log(shots);
  try {
    for (let shot of shots) {
      // console.log("club", club);
      // const clubFound = await Club.findOne({ _id: club._id }).exec();
      // console.log("clubfound before", clubFound);
      // if (clubFound.shots) clubFound.shots = [...clubFound.shots, item._id];
      // else clubFound.shots = [item._id];
      // console.log("clbfound after", clubFound);
      // await clubFound.save();
      if (club.shots) {
        club.shots = [...club.shots, shot._id];
      } else {
        club.shots = [shot._id];
      }
      // console.log("clbfound after", club);
      await club.save();
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
  },
  {
    name: "4 Hybrid",
    brand: "Callaway",
    user: USER_ID
  },
  {
    name: "4 Iron",
    brand: "TaylorMade",
    user: USER_ID
  },
  {
    name: "5 Iron",
    brand: "TaylorMade",
    user: USER_ID
  },
  {
    name: "6 Iron",
    brand: "TaylorMade",
    user: USER_ID
  },
  {
    name: "7 Iron",
    brand: "TaylorMade",
    user: USER_ID
  },
  {
    name: "8 Iron",
    brand: "TaylorMade",
    user: USER_ID
  },
  {
    name: "9 Iron",
    brand: "TaylorMade",
    user: USER_ID
  },
  {
    name: "50 Degree Wedge",
    brand: "TaylorMade",
    user: USER_ID
  },
  {
    name: "54 Degree Wedge",
    brand: "TaylorMade",
    user: USER_ID
  },
  {
    name: "58 Degree Wedge",
    brand: "TaylorMade",
    user: USER_ID
  }
];

module.exports = { clubs, addShotsToClub, deleteClubs, createClubs };
