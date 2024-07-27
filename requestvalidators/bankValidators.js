const { body } = require("express-validator");

const validateBank = [
  body("bankName").notEmpty().withMessage("Bank name is required"),
  body("accountNumber")
    .notEmpty()
    .withMessage("Account number is required")
    .isLength({ min: 11, max: 16 })
    .withMessage("Account number must be between 11 and 16 characters"),
  body("accountHolderName")
    .notEmpty()
    .withMessage("Account holder name is required"),
  body("ifscCode")
    .notEmpty()
    .withMessage("IFSC code is required")
    .isLength({ min: 11, max: 11 })
    .withMessage("IFSC code must be 11 characters long"),
];

module.exports = { validateBank };
