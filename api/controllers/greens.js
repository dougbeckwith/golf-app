const Green = require("../models/green");

const createGreen = async (req, res, next) => {
  const { dateCreated, greens, user } = req.body;

  try {
    const green = await Green.create({ dateCreated, greens, user });
    res.status(201).send({ greenId: green._id });
  } catch (error) {
    next(error);
  }
};

const deleteGreen = async (req, res, next) => {
  try {
    await Green.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const sendGreens = async (req, res, next) => {
  try {
    res.status(200).send(req.greens);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGreen,
  deleteGreen,
  sendGreens
};
