const Club = require("../models/club");
const Put = require("../models/put");
const Shot = require("../models/shot");
const Green = require("../models/green");
const Goal = require("../models/goal");
const Fairway = require("../models/fairway");
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

const isGoal = async (req, res, next) => {
  try {
    const goal = await Goal.find({ user: req.currentUser._id });

    if (!goal) {
      return next(new AppError("Goal Not Found", 404));
    }

    req.goals = goal[0];
    next();
  } catch (err) {
    next(err);
  }
};

const isGreen = async (req, res, next) => {
  try {
    const green = await Green.findById(req.params.id);

    if (!green) {
      return next(new AppError("Green Not Found", 404));
    }

    req.green = green;
    next();
  } catch (err) {
    next(err);
  }
};

const isGreens = async (req, res, next) => {
  try {
    const greens = await Green.find({ user: req.currentUser._id });

    if (!greens) {
      return next(new AppError("Greens Not Found", 404));
    }

    req.greens = greens;
    next();
  } catch (err) {
    next(err);
  }
};

const isFairway = async (req, res, next) => {
  try {
    const fairway = await Fairway.findById(req.params.id);

    if (!fairway) {
      return next(new AppError("Fairway Not Found", 404));
    }

    req.fairway = fairway;
    next();
  } catch (err) {
    next(err);
  }
};

const isFairways = async (req, res, next) => {
  try {
    const fairways = await Fairway.find({ user: req.currentUser._id });

    if (!fairways) {
      return next(new AppError("Fairways Not Found", 404));
    }

    req.fairways = fairways;
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
      return next(new AppError("Puts Not Found", 404));
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
  isGoal,
  isGreen,
  isGreens,
  isFairway,
  isFairways,
  isPut,
  isPuts,
  isShot
};
