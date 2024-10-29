const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB connected");
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
