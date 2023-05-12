const Club = require("../models/Club");

// GET all clubs
const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find({});
    res.status(200).send(clubs);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// GET a single club
const getClub = async (req, res) => {
  const { id } = req.params;

  try {
    const club = await Club.findById(id);
    res.status(200).send(club);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// CREATE new club
const createClub = async (req, res) => {
  try {
    const club = await Club.create(req.body);
    res.status(200).send(club);
  } catch {
    res.status(400).send({ error: error.message });
  }
};

const updateClub = async (req, res) => {
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
