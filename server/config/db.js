const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database connected successfully...")
    }
    catch (error){
        console.log("failed to connect");
        console.log(error);
    }
}
module.exports=connectDB