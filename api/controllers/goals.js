const Goal = require("../models/goal");

const createGoal = async (req, res, next) => {
  try {
    await Goal.create({ ...req.body });
    res.status(201).end();
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

const updateGoal = async (req, res, next) => {
  try {
    await Goal.findByIdAndUpdate(req.params.id, { ...req.body });
    res.status(200).end();
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
  updateGoal,
  sendGoal
};
