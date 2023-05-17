const express = require("express");
const router = express.Router();

const { createUser, getUser } = require("../controllers/userController");

// Routes
router.get("/:id", getUser);
router.post("/", createUser);

module.exports = router;
