// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');

// MongoDB Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
} else {
  console.error('❌ MONGODB_URI not found in .env file');
  console.log('📝 Please add MONGODB_URI to your .env file');
  console.log('   Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp');
}

module.exports = mongoose;