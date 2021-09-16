import { Request, Response, NextFunction } from "express";
import  jwt from "jsonwebtoken";
import { config } from './config';
import { Post } from "./blog/BlogModels";
import * as User from "./enums/user";
import rateLimit from "express-rate-limit";
import multer from "multer";

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let post;
  try {
    post = await Post.findById(req.body.id);
    if (post == null) {
      return res.status(404).json({ Status: "Failure", message: "Cannot find User" });
    }
  } catch (err: Error | any) {
    return res.status(500).json({ Status: "Error", message: err.message });
  }

  return next();
};

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try{
    const token = req.header("x-auth-token");
    
    if(!token)
    {
      return res.status(401).json({ Status: "Denied", message: "No authentication token, access denied" });
    }
    
    const verified = jwt.verify(token, config.jwtSecret);
    
    if(!verified)
    {
      return res.status(401).json({ Status: "Denied", message: "Token verification failed, authorization denied" });
    }
    
    return next();
  } catch (err: Error | any) {
    return res.status(500).json({ Status: "Error", message: "Error: "+ err.message });
  }
}

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("x-auth-token");
    
    if(!token)
    {
      return res.status(401).json({ Status: "Denied", message: "No authentication token, access denied" });
    }

    const verified = jwt.verify(token, config.jwtSecret);
    
    if (!verified) return res.status(401).json({Status: "Denied", message: "Invalid token content"});
    
    //@ts-ignore
    const user = verified.user;
    
    if (user !== User.user.ADMIN) return res.status(401).json({Status: "Denied", message: "User doesn't have Admin access"});
      
    return next();
  } catch (err: Error | any) {
    return res.status(500).json({Status: "Error", message: 'Error: '+ err.message });
  }
}

export const rateLimiter = rateLimit({
  max: 5,
  windowMs: 24 * 60 * 60 * 1000, //one day
  message: "Too many attempts!",
});

export const largeLimiter = rateLimit({
  max: 50,
  windowMs: 24 * 60 * 60 * 1000, //one day
  message: "Too many attempts!",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

export const upload = multer({ storage: storage });

