const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/user-auth");
const { getShots, createShot, deleteShot } = require("../controllers/shotController");

router.get("/", authenticateUser, getShots);
router.post("/", authenticateUser, createShot);
router.delete("/:shotId", authenticateUser, deleteShot);

module.exports = router;
