const express = require("express");
const router = express.Router({ mergeParams: true });

const { authenticateUser } = require("../middleware/user-auth");
const { createShot, deleteShot } = require("../controllers/shotController");

router.post("/", authenticateUser, createShot);
router.delete("/:shotId", authenticateUser, deleteShot);

module.exports = router;
