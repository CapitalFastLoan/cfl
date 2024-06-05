const Address = require("../models/address");
const { validationResult } = require("express-validator");
const saveAddress = async (req, res) => {
  try {
  const { user } = req;
  
  const userId = user._id;
  const addresses = await Address.find({ userId: userId });
    if (addresses.length) {
      return res.status(400).send({ message: 'Address exists for this user..' });
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
    .json({ message: "Address details saved successfully."});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {saveAddress}