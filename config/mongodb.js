const mongoose = require("mongoose");
require("dotenv").config();

const mongoUrl = process.env.MONGO_URI;
// "mongodb://127.0.0.1:27017/starterX"

async function connectDB() {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Database successfully");
  } catch (err) {
    console.log("Error connecting to the database:", err.message);
    process.exit(1); // Exit the process with an error code
  }
}

connectDB();

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

module.exports = db;
