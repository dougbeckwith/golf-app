const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/userAuth");
const { sendGoal, createGoal, deleteGoal } = require("../controllers/goals");
const { isGoalOwner } = require("../middleware/isOwner");
const { isGoal } = require("../middleware/isDocument");

router.get("/", authenticateUser, isGoal, isGoalOwner, sendGoal);
router.post("/", authenticateUser, createGoal);
router.delete("/:id", authenticateUser, isGoal, isGoalOwner, deleteGoal);

module.exports = router;
