const mongoose = require("mongoose");

const crypto = require("crypto");
const { type } = require("os");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  relation: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    father_name: {
        type: String,
        required: true,
    },
    marital_status: {
      
        type: String,
        enum: ["single", "married","divorced","widower"],
        required: true,
    },
    spouse:{
      type: String,
      required:false
    },
    qualification_status: {
        type: String,
        enum: ["graduate", "non graduate","10th pass or less","8th pass or less"],
        required: true,
    },
    occupation_status: {
        type: String,
        enum: ["business", "salaried","student"],
        required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin","employee"],
      default: "customer",
    },
    profilepic:{
      type:String,
      required:false
    },
    termsandconditions:{
      type: Boolean,
      default:false,
      required:true
    },
    emergency_contacts: [ContactSchema],
    aadharVerified: {
      type: Boolean,
      default: false
    },
    aadharNumber: {
      type: String,
      unique: true,
      sparse: true, 
    },
    aadharData:{
      type: mongoose.Schema.Types.Mixed,
      required:false,
      default:{}
    },
    hash: String,
    salt: String,
  },
  { timestamps: true }
);

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString("hex");
};

UserSchema.methods.validatePassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.hash === hash;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
