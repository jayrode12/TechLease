const mongoose = require("mongoose")

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://jaycomputers:Jaycomputers@cluster0.l9m2yjw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {})
        console.log("MongoDB connected");
    }
    catch(err){
        console.error("Error connecting to MONGODB", err);
        process.exit(1);
    }
};

module.exports = connectDB;
