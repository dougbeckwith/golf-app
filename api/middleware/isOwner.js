const Club = require("../models/club");
const AppError = require("../helpers/AppError");
const { isDocumentOwner, isDocumentsOwner } = require("../helpers/documents");

const isClubOwner = async (req, res, next) => {
  if (!isDocumentOwner(req.club, req.currentUser._id)) {
    return next(new AppError("Not Authorized", 403));
  }
  next();
};

const isClubsOwner = async (req, res, next) => {
  if (!isDocumentsOwner(req.clubs, req.currentUser._id)) {
    return next(new AppError("Not Authorized", 403));
  }
  next();
};

const isPutOwner = async (req, res, next) => {
  if (!isDocumentOwner(req.put, req.currentUser._id)) {
    return next(new AppError("Not Authorized", 403));
  }
  next();
};

const isPutsOwner = async (req, res, next) => {
  if (!isOwnerOfAllDocuments(req.puts, req.currentUser._id)) {
    return next(new AppError("Not Authorized", 403));
  }
  next();
};

const isShotOwner = async (req, res, next) => {
  if (!isDocumentOwner(req.shot, req.currentUser._id)) {
    return next(new AppError("Not Authorized", 403));
  }
  next();
};

module.exports = {
  isClubOwner,
  isClubsOwner,
  isPutOwner,
  isPutsOwner,
  isShotOwner
};
