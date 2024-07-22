const axios = require("axios");

const callCurl = async (data, url, auth) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${auth}`,
      },
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    console.error('error',error);
    throw new Error(`Error in callCurl: ${error.message}`);
  }
};

module.exports = { callCurl };
