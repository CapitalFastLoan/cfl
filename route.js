const express = require("express"),
  router = express.Router(),
  path = require("path");
/* Setting public directory for images */
router.use(express.static(path.join(__dirname, "./uploads/")));
const {
  validateSignup,
  validateLogin,
  validateUserExists,
  validatePasswordReset,
} = require("./requestvalidators/authValidators");

const {
  validateAddress,
  occupationValidationRules,
  profilepicValidator,
  validateContacts,
  validateContactUs,
} = require("./requestvalidators/userInfo");

const { validateToken } = require("./middlewares");

// Import controllers
const {
  signup,
  login,
  profile,
  isUserExists,
  resetPassword,
} = require("./controllers/authController");
const { uploadFile } = require("./controllers/uploadFile");
const {
  saveAddress,
  saveoccupation,
  saveUserProfilePic,
  saveUserEmegencyContacts,
  acceptTandC,
} = require("./controllers/userInfo");
const { saveMessage } = require("./controllers/contactuscontroller");

const {
  requestAadharOtp,
  verifyAadharOtp,
  getPanCardDetails,
} = require("./controllers/aadharController");

const {
  validateAadharNumber,
  validateAadharOtpVerify,
  validatePanCard,
} = require("./requestvalidators/aadharValidators");

/* Bank Controllers */

const {
  validateBank,
  isLoanReqPending,
  validateLoanRequest,
} = require("./requestvalidators/bankValidators");

const {
  saveBankAccount,
  getBankAccounts,
  getUserLimit,
  requestLoan,
} = require("./controllers/loanController");

// Define routes
router.post("/isUserExists", validateUserExists, isUserExists);
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/profile", validateToken, profile);
router.post("/saveaddress", validateToken, validateAddress, saveAddress);
router.post("/upload", validateToken, uploadFile);
router.post(
  "/saveEmergencyContacts",
  validateToken,
  validateContacts,
  saveUserEmegencyContacts
);
router.post(
  "/saveuserbusinessinfo",
  validateToken,
  occupationValidationRules,
  saveoccupation
);

router.post("/accept-terms-conditions", validateToken, acceptTandC);
router.post("/contact-us", validateToken, validateContactUs, saveMessage);
router.post(
  "/updateProfileImage",
  validateToken,
  profilepicValidator,
  saveUserProfilePic
);
router.post("/password-reset", validatePasswordReset, resetPassword);

router.post(
  "/aadhar-requestotp",
  validateToken,
  validateAadharNumber,
  requestAadharOtp
);
router.post(
  "/aadhar-verifyotp",
  validateToken,
  validateAadharOtpVerify,
  verifyAadharOtp
);
router.post(
  "/verify-pancard",
  validateToken,
  validatePanCard,
  getPanCardDetails
);

/* Loan related routes */

router.post("/add-bank", validateToken, validateBank, saveBankAccount);
router.get("/user-bank-accounts", validateToken, getBankAccounts);
router.get("/get-loan-limit", validateToken, getUserLimit);
router.post(
  "/request-loan",
  validateToken,
  isLoanReqPending,
  validateLoanRequest,
  requestLoan
);
// 404 error handler (ensure this is the last route)
router.use((req, res) => res.status(404).json({ error: "Url not found" }));

module.exports = router;
