const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/userAuth");
const { sendGreens, createGreen, deleteGreen } = require("../controllers/greens");
const { isGreenOwner, isGreensOwner } = require("../middleware/isOwner");
const { isGreen, isGreens } = require("../middleware/isDocument");

router.get("/", authenticateUser, isGreens, isGreensOwner, sendGreens);
router.post("/", authenticateUser, createGreen);
router.delete("/:id", authenticateUser, isGreen, isGreenOwner, deleteGreen);

module.exports = router;
