const { decodeToken } = require("./jwt");
const UserModel = require("./models/User");
const AddressModel = require("./models/address");
const OccupationModel = require("./models/OccupationInfo");
let cacheUserdata = {};

const validateToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }
    const token = authorization.split(" ")[1];
    const tokenDecoded = await decodeToken(token);
    if (!tokenDecoded) {
      return res.status(401).json({ message: "Session timed out." });
    }
    const { id: userId } = tokenDecoded;
    cacheUserdata = {};
    let user = cacheUserdata[userId];
    let result;
    if (!user) {
      user = await UserModel.findById(userId).select("-hash -salt");
      if (!user) {
        return res.status(401).json({ message: "Unauthorized Request" });
      }
      const address = await AddressModel.findOne({ userId: user._id });
      const occupationInfo = await OccupationModel.findOne({
        userId: user._id,
      });

      result = {
        ...user.toObject(),
        address: address ? address.toObject() : null,
        occupation: occupationInfo ? occupationInfo.toObject() : null,
      };
      cacheUserdata[userId] = result;
    } else {
      result = user;
    }
    req.user = result;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = { validateToken, cacheUserdata };
