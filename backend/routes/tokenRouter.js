const express = require("express");
const router = express.Router();
const { generateToken } = require("../controllers/tokenController");
const { verifyToken } = require("../middlewares/auth");

router.get("/generateToken", verifyToken, generateToken);

module.exports = router;