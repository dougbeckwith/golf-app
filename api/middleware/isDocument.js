const Club = require("../models/club");
const Put = require("../models/put");
const Shot = require("../models/shot");
const AppError = require("../helpers/AppError");

const isClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id).populate("shots").exec();
    if (!club) {
      return next(new AppError("Club Not Found", 404));
    }
    req.club = club;
    next();
  } catch (err) {
    next(err);
  }
};

const isClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find({ user: req.currentUser._id }).populate("shots").exec();

    if (!clubs) {
      return next(new AppError("Clubs Not Found", 404));
    }

    req.clubs = clubs;
    next();
  } catch (err) {
    next(err);
  }
};

const isPut = async (req, res, next) => {
  try {
    const put = await Put.findById(req.params.id);

    if (!put) {
      return next(new AppError("Put Not Found", 404));
    }

    req.put = put;
    next();
  } catch (err) {
    next(err);
  }
};

const isPuts = async (req, res, next) => {
  try {
    const puts = await Put.find({ user: req.currentUser._id });
    if (!puts) {
      return next(new AppError("Put Not Found", 404));
    }

    req.puts = puts;
    next();
  } catch (err) {
    next(err);
  }
};

const isShot = async (req, res, next) => {
  try {
    const shot = await Shot.findById(req.params.shotId);
    if (!shot) {
      return next(new AppError("Shot Not Found", 404));
    }
    req.shot = shot;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  isClub,
  isClubs,
  isPut,
  isPuts,
  isShot
};
