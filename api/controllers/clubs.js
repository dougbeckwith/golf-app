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

const getClub = async (req, res, next) => {
  try {
    // const club = await Club.findById(req.params.id).populate("shots").exec();
    res.status(200).send(req.club);
  } catch (error) {
    next(error);
  }
};

const getClubs = async (req, res, next) => {
  try {
    // const clubs = await Club.find({ user: req.currentUser._id }).populate("shots").exec();
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
  getClub,
  getClubs,
  updateClub
};
