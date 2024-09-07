import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    
    
  });

  export const User = mongoose.model("user",userSchema)