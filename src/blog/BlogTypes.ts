import { Document } from "mongoose";

export interface IPost extends Document {
  Title: string;
  Date: Date;
  Description: string;
  Image: any;
  MarkDown: string;
}
