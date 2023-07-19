const Club = require("../models/club");
const AppError = require("../helpers/AppError");
const { isDocumentOwner } = require("../helpers/document");

const getClub = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.currentUser._id;

  try {
    const club = await Club.findById(id);

    if (!club) {
      throw new AppError("Club Not Found");
    }

    if (!isDocumentOwner(club, userId)) {
      throw new AppError("Not Authorized");
    }

    res.status(200).send(club);
  } catch (error) {
    next(error);
  }
};

const getClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find({ user: req.currentUser._id }).populate("shots");

    if (!clubs) {
      // res.status(404).end();
      throw new AppError("Clubs Not Found");
    }
    res.status(200).send(clubs);
  } catch (error) {
    // console.log(error);
    // res.status(500).end();
    next(error);
  }
};

const createClub = async (req, res) => {
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
    // console.log(error);

    // // check error was ValidationError
    // if (error.name === "ValidationError") {
    //   let errors = [];

    //   Object.keys(error.errors).forEach((key) => {
    //     errors.push(error.errors[key].message);
    //   });

    //   res.status(400).send({ errors });
    // } else {
    //   res.status(500).end();
    // }
    next(error);
  }
};

// UPDATE one club (deleteShot, addShot, updateName)
const updateClub = async (req, res) => {
  const clubId = req.params.id;
  const { addShot, deleteShot, updateName, shotId, shot } = req.body;

  try {
    const club = await Club.findById(clubId);

    if (!club) {
      res.status(404).end();
      return;
    }

    if (club && updateName) {
      club.name = updateName.club;
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

const deleteClub = async (req, res) => {
  const { id } = req.params;

  try {
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
