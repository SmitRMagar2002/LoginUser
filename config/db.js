const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("")
    console.log("Connected to Auth Service Database");
}

module.exports = connectDB;