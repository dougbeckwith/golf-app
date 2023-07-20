const AppError = require("../helpers/AppError");
const Put = require("../models/put");
const { isDocumentOwner, isOwnerOfAllDocuments } = require("../helpers/document");

const createPut = async (req, res, next) => {
  const { puts, dateCreated, user } = req.body;

  try {
    const put = await Put.create({ puts, dateCreated, user });

    res.status(201).send({ putId: put._id });
  } catch (error) {
    next(error);
  }
};

const deletePut = async (req, res, next) => {
  const putId = req.params.id;
  const userId = req.currentUser._id;

  try {
    const put = await Put.findById(putId);

    if (!put) {
      throw new AppError("Put Not Found", 404);
    }
    if (!isDocumentOwner(put, userId)) {
      throw new AppError("Not Authorized", 404);
    }

    await Put.findByIdAndDelete(putId);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getPuts = async (req, res, next) => {
  const userId = req.currentUser._id;

  try {
    const puts = await Put.find({ user: userId });

    if (!puts) {
      throw new AppError("Put Not Found", 404);
    }
    if (!isOwnerOfAllDocuments(puts, userId)) {
      throw new AppError("Not Authorized", 403);
    }

    res.status(200).send(puts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPut,
  deletePut,
  getPuts
};
