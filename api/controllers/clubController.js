const AppError = require("../helpers/AppError");
const Club = require("../models/club");
const { isDocumentOwner, isOwnerOfAllDocuments } = require("../helpers/document");

const createClub = async (req, res, next) => {
  try {
    await Club.create({ ...req.body });
    res.status(201).end();
  } catch (error) {
    next(error);
  }
};

const deleteClub = async (req, res, next) => {
  const clubId = req.params.id;
  const userId = req.currentUser._id;

  try {
    const club = await Club.findById(clubId);

    if (!club) {
      throw new AppError("Club Not Found", 404);
    }
    if (!isDocumentOwner(club, userId)) {
      throw new AppError("Not Authorized", 403);
    }

    await Club.findByIdAndDelete(clubId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getClub = async (req, res, next) => {
  const clubId = req.params.id;
  const userId = req.currentUser._id;

  try {
    const club = await Club.findById(clubId).populate("shots").exec();

    if (!club) {
      throw new AppError("Club Not Found", 404);
    }
    if (!isDocumentOwner(club, userId)) {
      throw new AppError("Not Authorized", 403);
    }

    res.status(200).send(club);
  } catch (error) {
    next(error);
  }
};

const getClubs = async (req, res, next) => {
  const userId = req.currentUser._id;

  try {
    const clubs = await Club.find({ user: userId }).populate("shots").exec();

    if (!clubs) {
      throw new AppError("Clubs Not Found", 404);
    }
    if (!isOwnerOfAllDocuments(clubs, userId)) {
      throw new AppError("Not Authorized", 403);
    }

    res.status(200).send(clubs);
  } catch (error) {
    next(error);
  }
};

const updateClub = async (req, res, next) => {
  const clubId = req.params.id;
  const userId = req.currentUser._id;

  try {
    const club = await Club.findById(clubId);

    if (!club) {
      throw new AppError("Club Not Found", 404);
    }
    if (!isDocumentOwner(club, userId)) {
      throw new AppError("Not Authorized", 403);
    }

    club.name = req.body.name;
    club.brand = req.body.brand;
    await club.save();

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
