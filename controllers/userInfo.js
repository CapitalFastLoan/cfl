const Address = require("../models/address");
const { validationResult } = require("express-validator");
const OccupationInfo = require("../models/OccupationInfo");
const User = require('../models/User');
const { cacheUserdata } = require("../middlewares");
const saveAddress = async (req, res) => {
  try {
    const { user } = req;

    const userId = user._id;
    const addresses = await Address.find({ userId: userId });
    if (addresses.length) {
      return res
        .status(400)
        .send({ message: "Address details exists for this user.." });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let {
      resident_info,
      resident_pincode,
      isPermanentAddSameAsResident,
      permanent_address,
      permanent_pincode,
    } = req.body;

    if (isPermanentAddSameAsResident) {
      permanent_address = resident_info;
      permanent_pincode = resident_pincode;
    }
    const address = new Address({
      resident_info,
      resident_pincode,
      permanent_address,
      permanent_pincode,
      userId,
    });
    await address.save();
    cacheUserdata[userId].address = address;
    return res
      .status(200)
      .json({ message: "Address details saved successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const saveoccupation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user } = req;

    const userId = user._id;
    const occupationInfo = await OccupationInfo.find({ userId: userId });
    if (occupationInfo.length) {
      return res
        .status(400)
        .send({ message: "Occupation details exists for this user.." });
    }

    const { ...info } = req.body;
    let occupationInfoData;
    if (user.occupation_status === "business") {
      occupationInfoData = {
        occupation_status: user.occupation_status,
        shopname: info.shopname,
        shopaddress: info.shopaddress,
        shoppincode: info.shoppincode,
        proof_of_validation: info.proof_of_validation,
        userId: user._id,
      };
    } else if (user.occupation_status === "salaried") {
      occupationInfoData = {
        occupation_status: user.occupation_status,
        officename: info.officename,
        officeaddress: info.officeaddress,
        officepincode: info.officepincode,
        proof_of_validation: info.proof_of_validation,
        userId: user._id,
      };
    } else {
      return res.status(400).send({ message: "Invalid occupation status" });
    }
    const savedInfo = await new OccupationInfo(occupationInfoData);
    await savedInfo.save();
    cacheUserdata[user._id].occupation = savedInfo;
    return res
      .status(200)
      .send({ message: "Information saved successfully", data: savedInfo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const saveUserProfilePic = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { user } = req;
    const userId = user._id;
    const { profilepic } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: profilepic },
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    cacheUserdata[user._id].profilepic = profilepic;
    return res.status(200).json({ data:cacheUserdata[user._id]});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};


const saveUserEmegencyContacts = async (req,res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { user } = req;
    const userId = user._id;
    const userData = await User.findById(userId);
    const contacts = req.body.contacts;
    if(!userData){
      return res.status(404).json({ error: 'User not found' });
    }
    userData.emergency_contacts = contacts;
    await userData.save();
    cacheUserdata[userId].emergency_contacts = userData.emergency_contacts;
    return res.status(200).json({ message: 'Contacts updated successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

const acceptTandC = async (req,res) => {
  try {
    const {accept_terms} = req.body;
    const { user } = req;
    const userId = user._id;
    const userData = await User.findById(userId);
    if(!userData){
      return res.status(404).json({ error: 'User not found' });
    }
    userData.termsandconditions = accept_terms;
    await userData.save();
    cacheUserdata[userId].termsandconditions = accept_terms;
    return res.status(200).json({ message: 'Success!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}
module.exports = { saveAddress, saveoccupation,saveUserProfilePic,saveUserEmegencyContacts,acceptTandC };
