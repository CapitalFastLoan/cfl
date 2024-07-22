const Usermodel = require("../models/User");
const { validationResult } = require("express-validator");
const { callCurl } = require("../utils/comman");
const urlBase = `https://api-preproduction.signzy.app/api/v3/`;
const accessToken = `uhQUjwyUZdeiShzbM3kxgeTgsdMBjzvr`;
const { cacheUserdata } = require("../middlewares");

const requestAadharOtp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }

    const userId = user._id;
    const userdata = await Usermodel.findById(userId);
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userdata.aadharVerified) {
      return res
        .status(409)
        .json({ message: "You've already verfied your aadhar card..." });
    }

    const { aadharNumber } = req.body;
    const apiUrl = `${urlBase}getOkycOtp`;
    const requestdata = JSON.stringify({
      aadhaarNumber: aadharNumber,
    });

    const { data, statusCode, message, error } = await callCurl(
      requestdata,
      apiUrl,
      accessToken
    );
    if (error) {
      return res.status(error.status).json({ error });
    }

    return res.status(statusCode).json({ message, data });
  } catch (error) {
    console.error("Error in requestAadharOtp:", error.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const verifyAadharOtp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }

    const { requestId, otp } = req.body;
    const apiUrl = `${urlBase}fetchOkycData`;
    const requestdata = JSON.stringify({
      requestId: requestId,
      otp: otp,
    });

    const userId = user._id;
    const userdata = await Usermodel.findById(userId);
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userdata.aadharVerified) {
      return res
        .status(409)
        .json({ message: "You've already verfied your aadhar card..." });
    }

    try {
      const { data, statusCode, message, error } = await callCurl(
        requestdata,
        apiUrl,
        accessToken
      );
      if (error) {
        return res.status(error.status).json({ error });
      }
      if (data && statusCode === 200) {
        userdata.aadharVerified = true;
        userdata.aadharNumber = data.aadhaar_number;
        userdata.aadharData = data;
        await userdata.save();
        cacheUserdata[userId].aadharVerified = true;
        cacheUserdata[userId].aadharNumber = data.aadhaar_number;
        cacheUserdata[userId].aadharData = data;
        return res.status(statusCode).json({ data, message });
      } else {
        return res.status(statusCode).json({ message });
      }
    } catch (error) {
      return res.status(error).json({ error });
    }
  } catch (error) {
    console.error("Error in requestAadharOtp:", error.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = { requestAadharOtp, verifyAadharOtp };
