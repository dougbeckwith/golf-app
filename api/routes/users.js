const express = require("express");
const router = express.Router();

const { createUser, getUser } = require("../controllers/users");
const { authenticateUser } = require("../middleware/userAuth");

router.get("/", authenticateUser, getUser);
router.post("/", createUser);

module.exports = router;
