const { v4: uuidv4 } = require("uuid");
const { USER_ID } = require("../constants");

const clubs = [
  {
    club: "Driver",
    brand: "Callaway",
    shots: [
      {
        totalDistance: 300,
        totalCarry: 280,
        shotId: uuidv4()
      }
    ],
    user: USER_ID
  },
  {
    club: "3 Wood",
    brand: "Callaway",
    shots: [
      {
        totalDistance: 275,
        totalCarry: 250,
        shotId: uuidv4()
      }
    ],
    user: USER_ID
  }
];

module.exports = [...clubs];
