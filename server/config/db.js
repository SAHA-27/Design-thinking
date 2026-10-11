const mongoose = require('mongoose');

let isConnected = false;
let useMockStore = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/servease_ai';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if no local MongoDB service
    });
    isConnected = true;
    useMockStore = false;
    console.log(`✅ MongoDB Connected to: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB connection failed (${error.message}).`);
    console.log(`⚡ Switching to ServEase Resilient In-Memory / File Mock Store for seamless standalone operation.`);
    isConnected = false;
    useMockStore = true;
  }
};

module.exports = {
  connectDB,
  isDbConnected: () => isConnected,
  isMockStore: () => useMockStore,
};
