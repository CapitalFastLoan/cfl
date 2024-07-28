const axios = require("axios");

const callCurl = async (data, url, auth) => {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${auth}`,
      },
      maxBodyLength: Infinity,
    });
    return response.data; 
};


module.exports = { callCurl };
