const express = require("express");
const router = express.Router();
const {
  validateSignup,
  validateLogin,
  validateUserExists,
} = require("./requestvalidators/authValidators");
const { validateToken } = require("./middlewares");
const {
    validateAddress
} = require("./requestvalidators/userInfo");

const {
  signup,
  login,
  profile,
  isUserExists,
} = require("./controllers/authController");
const {saveAddress} = require('./controllers/userInfo');
router.post("/isUserExists", validateUserExists, isUserExists);
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/profile", validateToken, profile);
router.post("/saveaddress", validateToken,validateAddress,saveAddress);
router.use((req, res) => res.status(404).json({ error: "Url not found" }));
module.exports = router;

