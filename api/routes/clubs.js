const express = require("express");
const router = express.Router();

const { createClub, getClubs, updateClub, getClub, deleteClub } = require("../controllers/clubs");

const { authenticateUser } = require("../middleware/userAuth");
const { isClubOwner, isClubsOwner } = require("../middleware/isOwner");
const { isClub, isClubs } = require("../middleware/isDocument");

router.get("/", authenticateUser, isClubs, isClubsOwner, getClubs);
router.post("/", authenticateUser, createClub);
router.get("/:id", authenticateUser, isClub, isClubOwner, getClub);
router.patch("/:id", authenticateUser, isClubOwner, updateClub);
router.delete("/:id", authenticateUser, isClubOwner, deleteClub);

module.exports = router;
