const Club = require("../models/Club");

// GET one club
const getClub = async (req, res) => {
  console.log("GET SINGLE CLUB");
  const { id } = req.params;

  try {
    const club = await Club.findById(id);
    // check if club exists
    if (!club) {
      res.status(404).end();
    }
    // check if client owns the club
    else if (!club.user.equals(req.currentUser._id)) {
      res.status(403).end();
    }
    // client owns the club send back the resource
    else {
      res.status(200).send(club);
    }
  } catch (error) {
    console.log(error);
    // if error type CastError the id sent wasn't type Object Id mongoose
    if (error.name === "CastError") {
      res.status(404).end();
    } else {
      res.status(500).end();
    }
  }
};

// GET all clubs
const getClubs = async (req, res) => {
  console.log("GET ALL CLUBS");
  try {
    const clubs = await Club.find({ user: req.currentUser._id });
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

// CREATE one club
const createClub = async (req, res) => {
  console.log("CREATE CLUB");
  try {
    await Club.create({
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

// UPDATE one club (deleteShot, addShot, updateName)
const updateClub = async (req, res) => {
  console.log("UPDATE CLUB");

  const clubId = req.params.id;
  const { addShot, deleteShot, updateName, shotId, shot } = req.body;

  try {
    const club = await Club.findById(clubId);

    if (!club) {
      res.status(404).end();
      return;
    }

    if (club && updateName) {
      club.club = updateName.club;
      club.brand = updateName.brand;
      await Club.findByIdAndUpdate(clubId, {
        ...club
      });
      res.status(200).end();
      return;
    }

    if (club && addShot) {
      // update the shots array adding the new shot
      club.shots = [...club.shots, { ...shot }];
      await Club.findByIdAndUpdate(clubId, {
        ...club
      });
      res.status(200).end();
      return;
    }

    if (club && deleteShot) {
      // filter the shots array to remove the shot with shotId sent
      club.shots = club.shots.filter((shot) => {
        return shot.shotId !== shotId;
      });
      await Club.findByIdAndUpdate(clubId, {
        ...club
      });
      res.status(200).end();
      return;
    }
  } catch (error) {
    console.log(error);

    // check if any validation errors on the model
    // create an array of errors to send back to client
    if (error.name === "ValidationError") {
      let errors = [];

      Object.keys(error.errors).forEach((key) => {
        errors.push(error.errors[key].message);
      });

      res.status(400).send({ errors });
    }
    // if error type CastError the id sent wasn't type Object Id mongoose
    else if (error.name === "CastError") {
      res.status(404).end();
    } else {
      res.status(500).end();
    }
  }
};

// DELETE one club
const deleteClub = async (req, res) => {
  console.log("DELETE CLUB");
  const { id } = req.params;

  try {
    // find club using the id params
    const club = await Club.findById(id);

    if (!club) {
      res.status(404).end();
    }
    // check if client making request owns the club
    else if (!club.user.equals(req.currentUser._id)) {
      res.status(403).end();
    }
    // club is owned by user we can delete
    else {
      await Club.findByIdAndDelete(id);
      res.status(204).end();
    }
  } catch (error) {
    // if error type CastError the id sent wasn't type Object Id mongoose
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
