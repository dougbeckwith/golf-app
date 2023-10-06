const express = require("express");
const router = express.Router({ mergeParams: true });

const { authenticateUser } = require("../middleware/userAuth");
const { createShot, deleteShot } = require("../controllers/shots");
const { isClubOwner, isShotOwner } = require("../middleware/isOwner");
const { isClub, isShot } = require("../middleware/isDocument");

router.post("/", authenticateUser, isClub, isClubOwner, createShot);
router.delete("/:shotId", authenticateUser, isShot, isShotOwner, deleteShot);

module.exports = router;
