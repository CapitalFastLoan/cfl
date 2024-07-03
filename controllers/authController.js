
const Usermodel = require("../models/User");
const OccupationModel = require("../models/OccupationInfo");
const AddressModel = require("../models/address");
const { validationResult } = require("express-validator");
const { genrateToken } = require("../jwt");
const {cacheUserdata} = require('../middlewares'); 

const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const reqbody = req.body;
    const {
      name,
      email,
      mobile,
      dob,
      spouse,
      father_name,
      marital_status,
      qualification_status,
      occupation_status,
      password,
    } = req.body;
    const user = new Usermodel({
      name,
      email,
      mobile,
      dob,
      father_name,
      marital_status,
      spouse,
      qualification_status,
      occupation_status,
    });
    user.setPassword(password);
    await user.save();
    const payload = { id: user.id, email: user.email, mobile: user.mobile };
    const authtoken = genrateToken(payload);
    return res
      .status(200)
      .json({ message: "User registered successfully", authtoken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { mobile, password } = req.body;
    const user = await Usermodel.findOne({ mobile });
    if (user) {
      const User = new Usermodel(user);
      const isPasswordmatch = await User.validatePassword(password);
      if (isPasswordmatch) {
        
        const payload = { id: user.id, email: user.email, mobile: user.mobile };
        const authtoken = genrateToken(payload);
        const address = await AddressModel.findOne({ userId: user._id });
        const occupationInfo = await OccupationModel.findOne({
          userId: user._id,
        });

       let result = {
          ...user.toObject(),
          address: address ? address.toObject() : null,
          occupation: occupationInfo ? occupationInfo.toObject() : null,
        };
        delete result.hash;
        delete result.salt;
        return res
          .status(200)
          .json({ message: "Signin successful.", authtoken: authtoken,data:result });
      }
    }
    return res.status(401).json({ message: "Inavalid credentials" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const profile = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }
    return res
      .status(200)
      .json({ data: user, message: "Data fetched successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const isUserExists = async (req,res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { mobile } = req.body;
    const user = await Usermodel.findOne({ mobile }).select('mobile');
    return res.status(200).json({userExists: user ? true : false })
    res.send(user)
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { signup, login,profile,isUserExists };
