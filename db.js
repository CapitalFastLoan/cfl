const mongoose = require('mongoose');
const db = async (uri) => {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    }
};
module.exports = {db,mongoose};