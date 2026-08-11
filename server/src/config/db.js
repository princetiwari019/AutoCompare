const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/autocompare';

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] Successfully connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Could not connect to MongoDB at ${mongoUri}:`, error.message);
    console.error(`[Database Note] Please ensure your local MongoDB service is running or provide a valid MONGO_URI in .env`);
    process.exit(1);
  }
};

module.exports = connectDB;
