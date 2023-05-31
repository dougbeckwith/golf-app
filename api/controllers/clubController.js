const Club = require("../models/Club");

// GET all clubs
const getClubs = async (req, res) => {
  try {
    console.log("get all clubs");
    const clubs = await Club.find({ user: req.currentUser._id });
    console.log("clubs:", clubs);

    if (!clubs) {
      res.status(404).end();
    } else {
      res.status(200).send(clubs);
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

// GET a single club
const getClub = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    console.log("get single club");

    // find club using the id params
    const club = await Club.findById(id);
    console.log("club:", club);
    if (!club) {
      res.status(404).end();
    } else if (!club.user.equals(req.currentUser._id)) {
      res.status(403).end();
    } else {
      res.status(200).send(club);
    }
  } catch (error) {
    console.log(error);
    // if error type CastError (id params can't be turned into objectid)
    if (error.name === "CastError") {
      res.status(404).end();
    } else {
      res.status(500).end();
    }
  }
};

// CREATE new club
const createClub = async (req, res) => {
  console.log("create club");
  try {
    const club = await Club.create({
      club: req.body.club,
      brand: req.body.brand,
      shots: [
        {
          totalCarry: req.body.totalCarry,
          totalDistance: req.body.totalDistance,
          shotId: req.body.shotId
        }
      ],
      user: req.body.user
    });
    console.log("club created:", club);

    res.status(201).end();
  } catch (error) {
    console.log(error);

    // check error was ValidationError
    if (error.name === "ValidationError") {
      let errors = [];

      Object.keys(error.errors).forEach((key) => {
        errors.push(error.errors[key].message);
      });

      res.status(400).send({ errors });
    } else {
      res.status(500).end();
    }
  }
};

const updateClub = async (req, res) => {
  console.log("update club started");
  const clubId = req.params.id;

  const { club, deleteShot, shotId, addShot, shot } = req.body;
  if (club) {
    try {
      const clubToUpdate = await Club.findById(clubId);
      clubToUpdate.club = club.club;
      clubToUpdate.brand = club.brand;
      await Club.findByIdAndUpdate(clubId, {
        ...clubToUpdate
      });

      res.status(200).end();
    } catch (error) {
      console.log(error);
      res.status(400).end();
    }
  }
  if (addShot) {
    console.log("add shot");
    try {
      const club = await Club.findById(clubId);
      club.shots = [...club.shots, { ...shot }];

      await Club.findByIdAndUpdate(clubId, {
        ...club
      });
      res.status(200).end();
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
    }
  }

  if (deleteShot) {
    try {
      const club = await Club.findById(clubId);
      club.shots = club.shots.filter((shot) => {
        return shot.shotId !== shotId;
      });
      await Club.findByIdAndUpdate(clubId, {
        ...club
      });

      res.status(200).end();
    } catch (error) {
      console.log(error);
      // check if any validation errors on the model
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
  }
};

// DELETE a club
const deleteClub = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("delete single club");

    // find club using the id params
    const club = await Club.findById(id);

    if (!club) {
      res.status(404).end();
    } else if (!club.user.equals(req.currentUser._id)) {
      res.status(403).end();
    } else {
      res.status(204).end();
    }
  } catch (error) {
    // if error type CastError
    if (error.name === "CastError") {
      res.status(404).end();
    } else {
      res.status(500).end();
    }
  }
};

module.exports = {
  createClub,
  getClub,
  getClubs,
  updateClub,
  deleteClub
};
