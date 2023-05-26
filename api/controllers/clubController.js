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
    console.log("club", club);

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
  console.log("update club");
  const id = req.params.id;
  const { clubName, clubBrand, shot, club, deleteShot, avgYards, shotId } =
    req.body;

  if (clubName && clubBrand) {
    try {
      await Club.findByIdAndUpdate(id, {
        clubName: clubName,
        brand: clubBrand
      });
      res.status(200).send("Success");
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
  if (shot) {
    try {
      const clubs = await Club.findOneAndUpdate(
        { _id: id },
        {
          shots: [...club.shots, shot],
          totalShots: club.totalShots + 1
        },
        { new: true }
      );
      // const clubs = await Club.findOne({_id: id})
      res.status(200).send(clubs);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  if (deleteShot === true) {
    try {
      const data = await Club.findOneAndUpdate(
        { _id: id },
        {
          shots: club.shots.filter((item) => {
            return item.id !== shotId;
          }),
          avgYards: avgYards,
          totalShots: club.totalShots - 1
        },
        { new: true }
      );
      // const data = await Club.findOne({_id: id})
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

// DELETE a club
const deleteClub = async (req, res) => {
  const { id } = req.params;

  try {
    await Club.findByIdAndDelete(id);
    // mabey don't need to do another datbase query here instead
    // if success we can update the clubs on the front end.
    const clubs = await Club.find({});
    res.status(200).send(clubs);
  } catch (error) {
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
