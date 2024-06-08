const express = require("express"),
  router = express.Router();


const {
  validateSignup,
  validateLogin,
  validateUserExists,
} = require("./requestvalidators/authValidators");

const {
  validateAddress,
  occupationValidationRules
} = require("./requestvalidators/userInfo");


const { validateToken } = require("./middlewares");

// Import controllers
const {
  signup,
  login,
  profile,
  isUserExists,
} = require("./controllers/authController");

const {uploadFile} = require('./controllers/uploadFile');
const { saveAddress, saveoccupation } = require("./controllers/userInfo");

// Define routes
router.post("/isUserExists", validateUserExists, isUserExists);
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/profile", validateToken, profile);
router.post("/saveaddress", validateToken, validateAddress, saveAddress);
router.post('/upload',validateToken,uploadFile);
router.post(
  "/saveuserbusinessinfo",
  validateToken,
  occupationValidationRules,
  saveoccupation
);


// 404 error handler (ensure this is the last route)
router.use((req, res) => res.status(404).json({ error: "Url not found" }));

module.exports = router;
