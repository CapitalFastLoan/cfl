const Address = require("../models/address");
const { validationResult } = require("express-validator");
const OccupationInfo = require("../models/OccupationInfo");
const saveAddress = async (req, res) => {
  try {
    const { user } = req;

    const userId = user._id;
    const addresses = await Address.find({ userId: userId });
    if (addresses.length) {
      return res
        .status(400)
        .send({ message: "Address exists for this user.." });
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
    return res
      .status(200)
      .send({ message: "Information saved successfully", data: savedInfo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = { saveAddress, saveoccupation };
