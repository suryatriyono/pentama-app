require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_USERNAME = process.env.USERNAME;
const MONGO_PASSWORD = process.env.PASSWORD;
const MONGO_DBNAME = process.env.DBNAME;
const MONGO_HOST = process.env.HOST;
const MONGO_PORT = process.env.PORT;

const MONGO_LOCAL_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}?authSource=admin`;
// Connect to MongoDB locally
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_LOCAL_URI);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error);
    process.exit(1);
  }
};

module.exports = connectDB;
