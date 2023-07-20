const Club = require("../models/club");
const Shot = require("../models/shot");

const createShot = async (req, res, next) => {
  const { club } = req.club;
  try {
    const shot = await Shot.create({ user: req.currentUser._id, club: req.params.id, ...req.body });

    if (club.shots) club.shots = [...club.shots, shot._id];
    else club.shots = [shot._id];
    await club.save();

    res.status(201).json({ shotId: shot._id });
  } catch (error) {
    next(error);
  }
};

const deleteShot = async (req, res) => {
  await Shot.findByIdAndDelete(req.params.shotId);

  const club = await Club.findById(req.params.id).populate("shots");
  const shots = club.shots.filter((shot) => {
    return shot._id !== req.params.shotId;
  });

  club.shots = shots;
  await club.save();

  res.status(200).end();
};

module.exports = {
  createShot,
  deleteShot
};
