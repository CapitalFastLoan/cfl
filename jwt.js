const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const genrateToken = (payload) => {
  const token = jwt.sign(payload, SECRET_KEY,{expiresIn:'48h'});
  return token;
};
const decodeToken = async (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error(error);
    return false;
  }
};
module.exports = { genrateToken,decodeToken };
