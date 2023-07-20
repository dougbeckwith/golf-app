const Club = require("../models/club");
const Shot = require("../models/shot");
const AppError = require("../helpers/AppError");
const { isDocumentOwner } = require("../helpers/document");

const createShot = async (req, res, next) => {
  const userId = req.currentUser._id;
  const clubId = req.params.id;

  try {
    const club = await Club.findById(clubId);
    const shot = await Shot.create({ user: userId, club: clubId, ...req.body });

    if (!club) {
      return next(new AppError("Club Not Found", 404));
    }
    if (!shot) {
      return next(new AppError("Shot Not Found", 404));
    }
    if (!isDocumentOwner(club, userId)) {
      return next(new AppError("Not Authorized", 403));
    }

    if (club.shots) club.shots = [...club.shots, shot._id];
    else club.shots = [shot._id];
    await club.save();

    res.status(201).json({ shotId: shot._id });
  } catch (error) {
    next(error);
  }
};

const deleteShot = async (req, res) => {
  const userId = req.currentUser._id;
  const clubId = req.params.id;
  const shotId = req.params.shotId;

  const club = await Club.findById(clubId).populate("shots");
  const shot = await Shot.findById(shotId);

  if (!club) {
    return next(new AppError("Club Not Found", 404));
  }
  if (!isDocumentOwner(club, userId)) {
    return next(new AppError("Not Authorized", 403));
  }

  if (!shot) {
    return next(new AppError("Shot Not Found", 404));
  }
  if (!isDocumentOwner(shot, userId)) {
    return next(new AppError("Not Authorized", 403));
  }

  await Shot.findByIdAndDelete(shotId);

  const shots = club.shots.filter((shot) => {
    return shot._id !== shotId;
  });

  club.shots = shots;
  await club.save();

  res.status(200).end();
};

module.exports = {
  createShot,
  deleteShot
};
