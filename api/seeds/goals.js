const Goal = require("../models/goal");
const { DEMO_USER_ID } = require("../constants");

const createGoal = async () => {
  const goal = {
    fairways: 50,
    greens: 20,
    puts: 40,
    user: DEMO_USER_ID
  };

  try {
    await Goal.create(goal);
  } catch (error) {
    throw error;
  }

  console.log("Goal created.");
};

const deleteGoal = async () => {
  console.log("Deleting goals...");
  await Goal.deleteMany({});
};

module.exports = { deleteGoal, createGoal };
