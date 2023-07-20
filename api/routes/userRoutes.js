const express = require("express");
const router = express.Router();

const { createUser, getUser } = require("../controllers/userController");
const { authenticateUser } = require("../middleware/userAuth");

router.get("/", authenticateUser, getUser);
router.post("/", createUser);

module.exports = router;
