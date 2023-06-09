const Puts = require("../models/Puts");

const getPuts = async (req, res) => {
  console.log("GET PUTS");
  try {
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

const createPut = async (req, res) => {
  console.log("CREATE PUT");
  try {
    res.status(201).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

const deletePut = async (req, res) => {
  console.log("DELETE PUT");
  try {
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

module.exports = {
  getPuts,
  createPut,
  deletePut
};
