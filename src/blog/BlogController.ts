import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { IPost } from "./BlogTypes";
import { Post } from "./BlogModels";
import axios from "axios";
import { config } from '../config';

export const GetPosts = (req: Request, res: Response) => {
  Post.find({}, (err, items) => {
    if (err) {
      res.status(500).json({Status: "Error", message: err.message, items: [] });
    } else {
      res.status(200).json({Status: "Success", message: "Succesfully retrieved posts", items: items });
    }
  });
};

export const UpdatePost = async (req: Request, res: Response) => {
  try {
    const post = req.body.post;
    const original = await Post.findById(req.body.id);

    if ( original?.Title === post.Title && original?.Description === post.Description) {
      res.status(300).json({Status: "Failure", message: "The updated post has no difference from original." });
    }

    await Post.findByIdAndUpdate(req.body.id, {
      Title: post.Title,
      Date: post.Date,
      Description: post.Description,
      Image: original?.Image
    });

    res.status(200).json({Status: "Success", message: "Succesfully updated post" });
  } catch (error: Error | any) {
    res.status(500).json({Status: "Error", message: error.message });
  }
};

export const RemovePost = async (req: Request, res: Response) => {
  try {
    const postRemoved = await Post.findByIdAndRemove(req.body.id);
    res.status(200).json({ Status: "Success", message: `Removed ${postRemoved?.Title}` });
  } catch (error: Error | any) {
    res.status(500).json({ Status: "Error", message: error.message });
  }
};

export const CreatePost = async (req: Request, res: Response) => {
  try {
    const post: IPost = JSON.parse(req.body.Post);
    const title: string = post.Title;
    const exists = await Post.findOne({ Title: title });
    
    if (exists) {
      return res.json({ Status: "Failure", message: "Post was not created! \n Title already exists!" });
    } 
    
    //@ts-ignore 
    const filePath = path.join(__dirname + "/../uploads/" + req.file.filename);
    console.log(filePath); 
    const newPost = new Post({
      Title: post.Title,
      Date: post.Date,
      Description: post.Description,
      Image: {
        //@ts-ignore
        data: fs.readFileSync(filePath),
        contentType: "image/png",
      }
    });
    
    const postForMedium = {
      title: post.Title,
      contentFormat: "markdown",
      content: post.Description,
      publishStatus: "public"
    }

    let mediumResponse = "";
    console.log("Post for medium")
    console.log(postForMedium);
    axios.post(config.medium, postForMedium, {
      headers: {
        'Authorization' : config.mediumToken
      }
    }).then(response => {
      console.log(response);
      if (response.status !== 201) {
        mediumResponse = `Did not post to medium, ${response.status} issue`; 
      } else {
        mediumResponse = "Successfully added to medium";
      }
      console.log(response);
    })  
    console.log(mediumResponse);
    console.log("read file trying to save")
    await newPost.save();
    
    return res.status(200).json({ Status: "Success", message: `New Post with Title: ${newPost.Title} added and ${mediumResponse}` });

  } catch (error: Error | any) {
    return res.status(500).json({ Status: "Error", message: error.message, stack: error.stack });
  }
};
