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

const isGreenOwner = async (req, res, next) => {
  if (!isDocumentOwner(req.green, req.currentUser._id)) {
    return next(new AppError("Not Authorized", 403));
  }
  next();
};

const isGreensOwner = async (req, res, next) => {
  if (!isDocumentsOwner(req.greens, req.currentUser._id)) {
    return next(new AppError("Not Authorized", 403));
  }
  next();
};

const isFairwayOwner = async (req, res, next) => {
  if (!isDocumentOwner(req.fairway, req.currentUser._id)) {
    return next(new AppError("Not Authorized", 403));
  }
  next();
};

const isFairwaysOwner = async (req, res, next) => {
  if (!isDocumentsOwner(req.fairways, req.currentUser._id)) {
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
  if (!isDocumentsOwner(req.puts, req.currentUser._id)) {
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
  isGreenOwner,
  isGreensOwner,
  isFairwayOwner,
  isFairwaysOwner,
  isPutOwner,
  isPutsOwner,
  isShotOwner
};
