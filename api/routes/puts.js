const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/userAuth");
const { sendPuts, createPut, deletePut } = require("../controllers/puts");
const { isPutOwner, isPutsOwner } = require("../middleware/isOwner");
const { isPut, isPuts } = require("../middleware/isDocument");

router.get("/", authenticateUser, isPuts, isPutsOwner, sendPuts);
router.post("/", authenticateUser, createPut);
router.delete("/:id", authenticateUser, isPut, isPutOwner, deletePut);

module.exports = router;
