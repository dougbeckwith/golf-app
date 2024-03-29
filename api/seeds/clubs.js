const Club = require("../models/club");
const { DEMO_USER_ID } = require("../constants");

// Since we generated 5 shots per club each time we call this
// function with a moved startIndex by + 5.
// This allows us to match the distances with the clubs:
// (Driver - 300 \ 280-3Wood \ 260- 4Hybrid...)
const addShotsToClub = async (club, shots, startIndex) => {
  let index = startIndex;

  for (let i = index; i < index + 5; i++) {
    try {
      if (club.shots) {
        club.shots = [...club.shots, shots[i]._id];
      } else {
        club.shots = [shots[i]._id];
      }
      await club.save();
    } catch (error) {
      throw error;
    }
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
    user: DEMO_USER_ID
  },
  {
    name: "3 Wood",
    brand: "Callaway",
    user: DEMO_USER_ID
  },
  {
    name: "4 Hybrid",
    brand: "Callaway",
    user: DEMO_USER_ID
  },
  {
    name: "4 Iron",
    brand: "TaylorMade",
    user: DEMO_USER_ID
  },
  {
    name: "5 Iron",
    brand: "TaylorMade",
    user: DEMO_USER_ID
  },
  {
    name: "6 Iron",
    brand: "TaylorMade",
    user: DEMO_USER_ID
  },
  {
    name: "7 Iron",
    brand: "TaylorMade",
    user: DEMO_USER_ID
  },
  {
    name: "8 Iron",
    brand: "TaylorMade",
    user: DEMO_USER_ID
  },
  {
    name: "9 Iron",
    brand: "TaylorMade",
    user: DEMO_USER_ID
  },
  {
    name: "50 Degree Wedge",
    brand: "TaylorMade",
    user: DEMO_USER_ID
  },
  {
    name: "54 Degree Wedge",
    brand: "TaylorMade",
    user: DEMO_USER_ID
  },
  {
    name: "58 Degree Wedge",
    brand: "TaylorMade",
    user: DEMO_USER_ID
  }
];

module.exports = {
  clubs,
  addShotsToClub,
  deleteClubs,
  createClubs
};
