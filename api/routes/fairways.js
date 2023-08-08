const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/userAuth");
const { sendFairways, createFairway, deleteFairway } = require("../controllers/fairways");
const { isFairwayOwner, isFairwaysOwner } = require("../middleware/isOwner");
const { isFairway, isFairways } = require("../middleware/isDocument");

router.get("/", authenticateUser, isFairways, isFairwaysOwner, sendFairways);
router.post("/", authenticateUser, createFairway);
router.delete("/:id", authenticateUser, isFairway, isFairwayOwner, deleteFairway);

module.exports = router;
