const Put = require("../models/put");

const createPut = async (req, res, next) => {
  const { dateCreated, puts, user } = req.body;

  try {
    const put = await Put.create({ dateCreated, puts, user });
    res.status(201).send({ putId: put._id });
  } catch (error) {
    next(error);
  }
};

const deletePut = async (req, res, next) => {
  try {
    await Put.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const sendPuts = async (req, res, next) => {
  try {
    res.status(200).send(req.puts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPut,
  deletePut,
  sendPuts
};
