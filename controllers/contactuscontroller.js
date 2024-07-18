const ContactUs = require("../models/ContactUs");
const { validationResult } = require("express-validator");

const saveMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { user } = req;
    const userId = user._id;
    const { name, email, message } = req.body;
    const savemessage = new ContactUs({ name, email, message, userId });
    await savemessage.save();
    return res
      .status(200)
      .json({
        message: "Thank you for reaching! We will get back to you soon.",
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = { saveMessage };
