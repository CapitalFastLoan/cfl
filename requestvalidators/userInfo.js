const { body } = require("express-validator");
const existingPincodes = [
  "303007",
  "302011",
  "303002",
  "303903",
  "303905",
  "302005",
  "302013",
  "303102",
  "303338",
  "303807",
  "303604",
  "303602",
  "303802",
  "302002",
  "303106",
  "303601",
  "303804",
  "303801",
  "303901",
  "302006",
  "303302",
  "303001",
  "302026",
  "303908",
  "303003",
  "303702",
  "303120",
  "303105",
  "302022",
  "302012",
  "303008",
  "303104",
  "303328",
  "303803",
  "302016",
  "302019",
  "303806",
  "303103",
  "303805",
  "302033",
  "302017",
  "303348",
  "303108",
  "302029",
  "303109",
  "302015",
  "302027",
  "303603",
  "302003",
  "303704",
  "303305",
  "303110",
  "302004",
  "302001",
  "303107",
  "303701",
  "303005",
  "303904",
  "303301",
  "303706",
  "303119",
  "302028",
  "303012",
  "303009",
  "302025",
  "302018",
  "303712",
  "302039",
];
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

const occupationValidationRules = [
  body().custom((value, { req }) => {
    if (req.user.occupation_status === "business") {
      if (!req.body.shopname) {
        throw new Error("Shop name is required");
      }
      if (!req.body.shopaddress) {
        throw new Error("Shop address is required");
      }
      if (!req.body.shoppincode || !/^\d{6}$/.test(req.body.shoppincode)) {
        throw new Error("Shop pinode must be a 6-digit numeric value");
      }
      if (!req.body.proof_of_validation) {
        throw new Error("Proof of validation is required");
      }
    } else if (req.user.occupation_status === "salaried") {
      if (!req.body.officename) {
        throw new Error("Office name is required");
      }
      if (!req.body.officeaddress) {
        throw new Error("Office address is required");
      }
      if (!req.body.officepincode || !/^\d{6}$/.test(req.body.officepincode)) {
        throw new Error("Office pincode must be a 6-digit numeric value");
      }
      if (!req.body.proof_of_validation) {
        throw new Error("Proof of validation is required");
      }
    } else {
      throw new Error("Invalid occupation status");
    }
    return true;
  }),
];

const profilepicValidator = [
  body("profilepic").notEmpty().withMessage("Profile picture is required"),
];

const validateContacts = [
  body("contacts")
    .isArray({ min: 1 })
    .withMessage("Contacts should be a non-empty array"),
  body("contacts.*.name").isString().withMessage("Name should be a string"),
  body("contacts.*.relation")
    .isString()
    .withMessage("Relation should be a string"),
  body("contacts.*.phone").isString().withMessage("Phone should be a string"),
  body("contacts.*.phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone should be 10 characters long"),
];

const validateContactUs = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("message").trim().notEmpty().withMessage("Message is required"),
];

module.exports = {
  validateAddress,
  occupationValidationRules,
  profilepicValidator,
  validateContacts,
  validateContactUs
};
