const { body } = require("express-validator");
const Bank = require("../models/Bank");
const Loan = require("../models/Loan");
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

const isLoanReqPending = async (req, res, next) => {
  try {
    const { user } = req;
    const existingLoan = await Loan.findOne({
      userId: user._id,
      $or: [
        { repayment_status: false, approval_status: { $ne: "rejected" } },
        { approval_status: "pending" },
      ],
    });
    if (existingLoan) {
      return res.status(400).json({
        message: "Can't request another loan untill paid/approved previous.",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
const validateLoanRequest = [
  body("loanAmount")
    .notEmpty()
    .withMessage("Loan amount is required")
    .isNumeric()
    .withMessage("Loan amount must be a number"),
  body("bankAccount")
    .isString()
    .notEmpty()
    .withMessage("Bank account is required")
    .custom(async (value, { req }) => {
      const { user } = req;
      const bankExists = await Bank.findOne({ _id: value, userId: user._id });
      if (!bankExists) {
        return Promise.reject("Bank account not found");
      }
    }),
  body("tenureDays")
    .notEmpty()
    .withMessage("Tenure days are required")
    .isInt({ min: 1 })
    .withMessage("Tenure days must be a positive integer"),
];
module.exports = { validateBank, isLoanReqPending, validateLoanRequest };
