const { body } = require("express-validator");
const User = require("../models/User");
const validateAadharNumber = [
    body('aadharNumber')
    .isLength({ min: 12, max: 12 }).withMessage('Aadhar number must be 12 characters long')
    .isNumeric().withMessage('Aadhar number must be numeric')
    .custom(async (value) => {
        const user = await User.findOne({ aadharNumber: value });
        if (user) {
          return Promise.reject("Aadhar number already in use");
        }
      }),
];


const validateAadharOtpVerify = [
  body("otp")
 .isLength({ min: 6, max: 6 }).withMessage('Otp must be 6 characters long'),
  body("requestId").trim().notEmpty().withMessage("Request id required"),
];

const validatePanCard = [
  body("pannumber")
    .notEmpty()
    .withMessage("Pan number is required.")
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage('Invalid PAN card number format')
    .custom(async (value) => {
      const user = await User.findOne({ panNumber: value });
      if (user) {
        return Promise.reject("Pan card already registered with us.");
      }
    })
];



module.exports = {validateAadharNumber,validateAadharOtpVerify,validatePanCard}
