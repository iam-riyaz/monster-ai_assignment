import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    imagePath:{
        type:String,
        required:true
    }
    
    
  });

  export const Post = mongoose.model("post",postSchema)