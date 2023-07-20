const Club = require("../models/club");
const Put = require("../models/put");
const Shot = require("../models/shot");
const AppError = require("../helpers/AppError");

const isClub = async (req, res, next) => {
  const club = await Club.findById(req.params.id).populate("shots").exec();

  if (!club) {
    return next(new AppError("Club Not Found", 404));
  }

  req.club = club;
  next();
};

const isClubs = async (req, res, next) => {
  const clubs = await Club.find({ user: req.currentUser._id }).populate("shots").exec();

  if (!clubs) {
    return next(new AppError("Clubs Not Found", 404));
  }

  req.clubs = clubs;
  next();
};

const isPut = async (req, res, next) => {
  const put = await Put.findById(req.params.id);

  if (!put) {
    return next(new AppError("Put Not Found", 404));
  }

  req.put = put;
  next();
};

const isPuts = async (req, res, next) => {
  const puts = await Put.find({ user: req.currentUser._id });

  if (!puts) {
    return next(new AppError("Put Not Found", 404));
  }

  req.puts = puts;
  next();
};

const isShot = async (req, res, next) => {
  const shot = await Shot.findById(req.params.shotId);

  if (!shot) {
    return next(new AppError("Shot Not Found", 404));
  }

  req.shot = shot;
  next();
};

module.exports = {
  isClub,
  isClubs,
  isPut,
  isPuts,
  isShot
};
