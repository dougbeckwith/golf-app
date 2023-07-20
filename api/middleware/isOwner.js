const Club = require("../models/club");
const AppError = require("../helpers/AppError");
const { isDocumentOwner, isDocumentsOwner } = require("../helpers/documents");

const isClubOwner = async (req, res, next) => {
  if (!isDocumentOwner(req.club, req.currentUser._id)) {
    throw new AppError("Not Authorized", 403);
  }
  next();
};

const isClubsOwner = async (req, res, next) => {
  if (!isDocumentsOwner(req.clubs, req.currentUser._id)) {
    throw new AppError("Not Authorized", 403);
  }
  next();
};

module.exports = {
  isClubOwner,
  isClubsOwner
};
