const Shot = require("../models/shot");
// const AppError = require("../helpers/AppError");

const getShots = async (req, res) => {
  res.send("get shots");
};

const createShot = async (req, res) => {
  res.send("create shot");
};

const deleteShot = async (req, res) => {
  res.send("delete shot");
};

module.exports = {
  createShot,
  getShots,
  deleteShot
};
