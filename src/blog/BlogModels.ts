import mongoose, { Schema } from "mongoose";
import { IPost } from "./BlogTypes";

const PostSchema: Schema = new Schema({
  Title: {
    type: String,
    required: true,
    unique: true,
  },
  Date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  Description: {
    type: String,
    required: true,
  },
  Image: {
    data: Buffer,
    contentType: String,
    required: false,
  },
  MarkDown: {
    type: String,
    required: false,
  },
});

export const Post = mongoose.model<IPost>("Post", PostSchema);
