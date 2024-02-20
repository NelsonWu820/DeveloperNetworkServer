const mongoose = require("mongoose");
require('dotenv').config();
const db = process.env.mongoURI;

//uses env variables to make mongouri secret then connects to mongo
const connectDB = async() => {
    try {
        await mongoose.connect(db);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;