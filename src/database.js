const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const logger = require('./utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    logger.error('Failed to connect to MongoDB');
    process.exit(1);  // Exit process with failure
  }
};

module.exports = connectDB;
