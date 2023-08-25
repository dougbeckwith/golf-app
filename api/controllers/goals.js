const Goal = require("../models/goal");

const createGoal = async (req, res, next) => {
  const { goals, user } = req.body;

  try {
    await Goal.create({ goals, user });
    res.status(201);
  } catch (error) {
    next(error);
  }
};

const deleteGoal = async (req, res, next) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const sendGoal = async (req, res, next) => {
  try {
    res.status(200).send(req.goals);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGoal,
  deleteGoal,
  sendGoal
};
