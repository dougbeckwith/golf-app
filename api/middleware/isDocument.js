const Club = require("../models/club");
const AppError = require("../helpers/AppError");

const isClub = async (req, res, next) => {
  const club = await Club.findById(req.params.id).populate("shots").exec();

  if (!club) {
    throw new AppError("Club Not Found", 404);
  }

  req.club = club;
  next();
};

const isClubs = async (req, res, next) => {
  const clubs = await Club.find({ user: req.currentUser._id }).populate("shots").exec();

  if (!clubs) {
    throw new AppError("Clubs Not Found", 404);
  }

  req.clubs = clubs;
  next();
};

module.exports = {
  isClub,
  isClubs
};
