const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);

    console.log(`Mongoose connection established: ${conn.connection.host}`.white.bold);
  } catch (error) {
    console.log("Error while setting up connection to MongoDB", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
