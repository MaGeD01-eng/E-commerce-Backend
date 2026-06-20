const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(process.env.MONG_URL)
    .then(()=>{
        console.log("DB connect!...");
    })
    .catch((err)=>{
        console.log("error in connection!....",err);
        process.exit(1);
    })
}

module.exports = connectDB;