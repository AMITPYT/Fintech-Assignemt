const express = require("express");
const router = express.Router();
const { submitProfile, getLatestProfile } = require("../controllers/profileController");

router.post("/submit", submitProfile);
router.get("/latest", getLatestProfile);

module.exports = router;