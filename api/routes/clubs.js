const express = require("express");
const router = express.Router();

const { createClub, deleteClub, sendClub, sendClubs, updateClub } = require("../controllers/clubs");

const { authenticateUser } = require("../middleware/userAuth");
const { isClubOwner, isClubsOwner } = require("../middleware/isOwner");
const { isClub, isClubs } = require("../middleware/isDocument");

router.get("/", authenticateUser, isClubs, isClubsOwner, sendClubs);
router.post("/", authenticateUser, createClub);
router.get("/:id", authenticateUser, isClub, isClubOwner, sendClub);
router.put("/:id", authenticateUser, isClub, isClubOwner, updateClub);
router.delete("/:id", authenticateUser, isClub, isClubOwner, deleteClub);

module.exports = router;
