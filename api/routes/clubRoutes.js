const express = require("express");
const router = express.Router();

const {
  createClub,
  getClubs,
  updateClub,
  getClub,
  deleteClub
} = require("../controllers/clubController");

const { authenticateUser } = require("../middleware/user-auth");

// Routes
router.get("/", authenticateUser, getClubs);
router.get("/:id", getClub);
router.post("/", createClub);
router.patch("/:id", updateClub);
router.delete("/:id", deleteClub);

module.exports = router;
