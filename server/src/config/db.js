const mongoose = require('mongoose');
const env = require('./env');

let cached = null;
let mongod = null;

async function connectDB() {
  if (cached) return cached;

  try {
    let uri = env.mongoUri;
    
    if (!uri) {
      console.log('No MONGO_URI provided. Starting in-memory MongoDB...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
    }

    cached = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return cached;
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
