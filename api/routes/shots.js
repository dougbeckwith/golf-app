const express = require("express");
const router = express.Router({ mergeParams: true });

const { authenticateUser } = require("../middleware/userAuth");
const { createShot, deleteShot } = require("../controllers/shots");

router.post("/", authenticateUser, createShot);
router.delete("/:shotId", authenticateUser, deleteShot);

module.exports = router;
