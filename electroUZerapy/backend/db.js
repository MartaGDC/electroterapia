import mongoose from "mongoose";

export const connectDB = (uri) => {
  try {
    mongoose.connect(uri);
    console.log("DB connected")
  } catch (error) {
    console.error(error);
  }
};