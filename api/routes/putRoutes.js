const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/userAuth");
const { getPuts, createPut, deletePut } = require("../controllers/putController");

router.get("/", authenticateUser, getPuts);
router.post("/", authenticateUser, createPut);
router.delete("/:id", authenticateUser, deletePut);

module.exports = router;
