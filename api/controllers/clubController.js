const Club = require("../models/Club");

// GET all clubs
const getClubs = async (req, res) => {
  try {
    console.log("get all clubs");
    const clubs = await Club.find({ user: req.currentUser._id });
    console.log("clubs", clubs);

    if (!clubs) {
      res.status(400).send({ error: "No Clubs Found" });
      return;
    }
    res.status(200).send(clubs);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

// GET a single club
const getClub = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("get single club");
    const club = await Club.findById(id);

    if (!club) {
      res.status(400).send({ error: "No Club Found" });
      return;
    }
    res.status(200).send(club);
  } catch (error) {
    console.log(error);
    res.status(500).end;
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
    console.log("club created", club);

    res.status(201).end();
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
};

const updateClub = async (req, res) => {
  console.log("update club started");
  const clubId = req.params.id;
  console.log(req.body);

  const { club, deleteShot, shotId, addShot, shot } = req.body;
  if (club) {
    console.log("update club name and brand");
    try {
      const clubBefore = await Club.findByIdAndUpdate(clubId, {
        name: club.name,
        brand: club.brand
      });
      console.log("club before", clubBefore);
      res.status(200).end();
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
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
    console.log("delete shot");
    try {
      const club = await Club.findOneAndUpdate(
        { _id: clubId },
        {
          shots: club.shots.filter((shot) => {
            return shot.shotId !== shotId;
          })
        },
        { new: true }
      );
      console.log(club);
      res.status(200).end();
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
    }
  }
};

// DELETE a club
const deleteClub = async (req, res) => {
  const { id } = req.params;

  try {
    const test = await Club.findByIdAndDelete(id);
    console.log(test);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  createClub,
  getClub,
  getClubs,
  updateClub,
  deleteClub
};
