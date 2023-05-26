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
router.get("/:id", authenticateUser, getClub);
router.post("/", authenticateUser, createClub);
router.patch("/:id", authenticateUser, updateClub);
router.delete("/:id", authenticateUser, deleteClub);

module.exports = router;
