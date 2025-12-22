require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const connectDB = require('../src/config/database');

const clearUsers = async () => {
    try {
        await connectDB();
        console.log('Connected to database...');

        const result = await User.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} users.`);

        process.exit(0);
    } catch (error) {
        console.error('Error clearing users:', error);
        process.exit(1);
    }
};

clearUsers();
