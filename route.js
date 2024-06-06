const express = require("express");
const router = express.Router();

// Import request validators
const {
  validateSignup,
  validateLogin,
  validateUserExists,
} = require("./requestvalidators/authValidators");

const {
  validateAddress,
} = require("./requestvalidators/userInfo");

// Import middlewares
const { validateToken } = require("./middlewares");

// Import controllers
const {
  signup,
  login,
  profile,
  isUserExists,
} = require("./controllers/authController");

const { saveAddress } = require('./controllers/userInfo');

// Define routes
router.post("/isUserExists", validateUserExists, isUserExists);
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/profile", validateToken, profile);
router.post("/saveaddress", validateToken, validateAddress, saveAddress);

// 404 error handler (ensure this is the last route)
router.use((req, res) => res.status(404).json({ error: "Url not found" }));

module.exports = router;
