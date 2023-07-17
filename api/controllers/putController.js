const Put = require("../models/put");
const { isDocumentOwner, isOwnerOfAllDocuments } = require("../helpers/document");

const getPuts = async (req, res) => {
  console.log("GET PUTS");

  const userId = req.currentUser._id;

  try {
    const puts = await Put.find({ user: req.currentUser._id });

    if (!puts) {
      res.status(404).end();
      return;
    }

    if (!isOwnerOfAllDocuments(puts, userId)) {
      res.status(403).end();
      return;
    }

    res.status(200).send(puts);
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
};

const createPut = async (req, res) => {
  console.log("CREATE PUT");

  const { puts, dateCreated, user } = req.body;

  try {
    const put = await Put.create({
      puts,
      dateCreated,
      user
    });

    res.status(201).send({ putId: put._id });
  } catch (error) {
    console.log(error);

    // check error was ValidationError
    if (error.name === "ValidationError") {
      let errors = [];

      Object.keys(error.errors).forEach((key) => {
        errors.push(error.errors[key].message);
      });

      res.status(400).send({ errors });
      return;
    }
    res.status(500).end();
  }
};

const deletePut = async (req, res) => {
  console.log("DELETE PUT");

  const { id } = req.params;
  const userId = req.currentUser._id;

  try {
    const put = await Put.findById(id);

    if (!put) {
      res.status(404).end();
      return;
    }

    if (!isDocumentOwner(put, userId)) {
      res.status(403).end();
      return;
    }

    await Puts.findByIdAndDelete(id);

    res.status(204).end();
  } catch (error) {
    console.log(error);

    if (error.name === "CastError") {
      res.status(404).end();
      return;
    }
    res.status(500).end();
  }
};

module.exports = {
  getPuts,
  createPut,
  deletePut
};
