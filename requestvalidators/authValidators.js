const { body } = require("express-validator");
const User = require("../models/User");
const validateSignup = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Email is invalid")
    .notEmpty()
    .withMessage("Email is required")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject("E-mail already in use");
      }
    }),
  body("mobile")
    .isMobilePhone()
    .withMessage("Mobile number is invalid")
    .notEmpty()
    .withMessage("Mobile number is required")
    .custom(async (value) => {
      const user = await User.findOne({ mobile: value });
      if (user) {
        return Promise.reject("Mobile number already in use");
      }
    }),
  body("dob")
    .isDate()
    .withMessage("Date of birth must be a valid date")
    .notEmpty()
    .withMessage("Date of birth is required"),
  body("father_name")
    .isString()
    .withMessage("Father name must be a string")
    .notEmpty()
    .withMessage("Father name is required"),
  body("marital_status")
    .isIn(["single", "married","divorced","widower"])
    .withMessage("Marital status must be single/married/divorced or widower.")
    .notEmpty()
    .withMessage("Marital status is required"),
    body("marital_status").custom((value, { req }) => {
      if (value === "married") {
        if (!req.body.spouse) {
          throw new Error("Spouse name is required when marital status is married");
        }
        return true;
      }
      return true;
    }),
  body("qualification_status")
    .isIn(["graduate", "non graduate","10th pass or less","8th pass or less"])
    .withMessage("Qualification status must be graduate or non graduate")
    .notEmpty()
    .withMessage("Qualification status is required"),
  body("occupation_status")
    .isIn(["business", "salaried","student"])
    .withMessage("Occupation status must be business or salaried or student.")
    .notEmpty()
    .withMessage("Occupation status is required"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
  body("role")
    .optional()
    .isIn(["customer", "admin", "employee"])
    .withMessage("Role must be customer, admin, or employee"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .notEmpty()
    .withMessage("Password is required"),
];

const validateLogin = [
  body("mobile")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isMobilePhone()
    .withMessage("Mobile number is invalid"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateUserExists = [
  body("mobile")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isMobilePhone()
    .withMessage("Mobile number is invalid"),
];


module.exports = { validateSignup, validateLogin,validateUserExists };

