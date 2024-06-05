const { decodeToken } = require("./jwt");
const UserModel = require("./models/User");
const cacheUserdata = {};

const validateToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }
    const token = authorization.split(" ")[1];
    const tokenDecoded = await decodeToken(token);
    if (!tokenDecoded) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }
    const { id: userId } = tokenDecoded;
    let user = cacheUserdata[userId];

    if (!user) {
        user = await UserModel.findById(userId).select('-hash -salt');
      if (!user) {
        return res.status(401).json({ message: "Unauthorized Request" });
      }
      cacheUserdata[userId] = user;
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {validateToken};

