const Fairway = require("../models/fairway");

const createFairway = async (req, res, next) => {
  const { dateCreated, fairways, user } = req.body;

  try {
    const fairway = await Fairway.create({ dateCreated, fairways, user });
    res.status(201).send({ fairwayId: fairway._id });
  } catch (error) {
    next(error);
  }
};

const deleteFairway = async (req, res, next) => {
  try {
    await Fairway.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const sendFairways = async (req, res, next) => {
  try {
    res.status(200).send(req.fairways);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFairway,
  deleteFairway,
  sendFairways
};
