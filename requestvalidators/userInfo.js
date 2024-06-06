const { body } = require("express-validator");
const existingPincodes = ["123456", "654321", "111111", "222222","302039"];
const validateAddress = [
  body("resident_info").notEmpty().withMessage("Resident info is required"),
  body("resident_pincode")
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage("Resident pincode must be a 6-digit numeric value")
    .custom((value) => {
      if (!existingPincodes.includes(value)) {
        throw new Error("Resident pincode is not valid");
      }
      return true;
    }),
  body("isPermanentAddSameAsResident")
    .isBoolean()
    .withMessage("isPermanentAddSameAsResident must be a boolean"),
  body("permanent_address").custom((value, { req }) => {
    if (!req.body.isPermanentAddSameAsResident && !value) {
      throw new Error(
        "Permanent address is required if it is different from the resident address"
      );
    }
    return true;
  }),
  body("permanent_pincode").custom((value, { req }) => {
    if (!req.body.isPermanentAddSameAsResident && !value) {
      throw new Error(
        "Permanent pincode is required if it is different from the resident pincode"
      );
    }
    if (
      value &&
      (!/^\d{6}$/.test(value) || !existingPincodes.includes(value))
    ) {
      throw new Error(
        "Permanent pincode must be a valid 6-digit numeric value"
      );
    }
    return true;
  }),
];
module.exports = { validateAddress };