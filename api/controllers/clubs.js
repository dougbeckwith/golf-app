const Club = require("../models/club");

const createClub = async (req, res, next) => {
  try {
    await Club.create({ ...req.body });
    res.status(201).end();
  } catch (error) {
    next(error);
  }
};

const deleteClub = async (req, res, next) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const sendClub = async (req, res, next) => {
  try {
    res.status(200).send(req.club);
  } catch (error) {
    next(error);
  }
};

const sendClubs = async (req, res, next) => {
  try {
    res.status(200).send(req.clubs);
  } catch (error) {
    next(error);
  }
};

const updateClub = async (req, res, next) => {
  try {
    await Club.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      brand: req.body.brand
    });
    res.status(200).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClub,
  deleteClub,
  sendClub,
  sendClubs,
  updateClub
};
