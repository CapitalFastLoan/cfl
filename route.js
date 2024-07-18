const express = require("express"),
  router = express.Router(),
  path = require('path');
/* Setting public directory for images */
  router.use(express.static(path.join(__dirname, './uploads/')));
const {
  validateSignup,
  validateLogin,
  validateUserExists
} = require("./requestvalidators/authValidators");

const {
  validateAddress,
  occupationValidationRules,
  profilepicValidator,
  validateContacts,
  validateContactUs
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
const { saveAddress, saveoccupation,saveUserProfilePic,saveUserEmegencyContacts,acceptTandC } = require("./controllers/userInfo");
const {saveMessage} = require('./controllers/contactuscontroller');
// Define routes
router.post("/isUserExists", validateUserExists, isUserExists);
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/profile", validateToken, profile);
router.post("/saveaddress", validateToken, validateAddress, saveAddress);
router.post('/upload',validateToken,uploadFile);
router.post('/saveEmergencyContacts',validateToken,validateContacts,saveUserEmegencyContacts)
router.post(
  "/saveuserbusinessinfo",
  validateToken,
  occupationValidationRules,
  saveoccupation
);

router.post("/accept-terms-conditions",validateToken,acceptTandC);
router.post("/contact-us",validateToken,validateContactUs,saveMessage);
router.post('/updateProfileImage',validateToken,profilepicValidator,saveUserProfilePic)

// 404 error handler (ensure this is the last route)
router.use((req, res) => res.status(404).json({ error: "Url not found" }));

module.exports = router;
