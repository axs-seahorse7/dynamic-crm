import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const con = await mongoose.connect("mongodb://127.0.0.1:27017/workzocrm");

    console.log("MongoDB Connected: " + con.connection.host);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
