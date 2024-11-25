// db.js
const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env file

// MongoDB connection logic
const connectDB = async () => {
    try {
        // await mongoose.connect(process.env.MONGODB_URL);
        await mongoose.connect(process.env.ATLAS_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);  // Exit the process if MongoDB connection fails
    }
};

module.exports = connectDB;
