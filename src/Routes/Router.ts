import { Router, Request, Response } from "express";
import { GetPosts, CreatePost, RemovePost, UpdatePost } from "../blog/BlogController";
import { getPost, auth, verifyAdmin, largeLimiter, upload } from "../Middleware";
const router = Router();

router.get("/contact/Contact", auth, (req: Request, res: Response) =>
  res.status(200).json({ Status: "Success", message: "Contact is Healthy" })
);

router.get("/blog/Posts", auth, largeLimiter, GetPosts);
router.post("/blog/CreatePost", auth, verifyAdmin, upload.single("file"), CreatePost);
router.post("/blog/RemovePost", auth, verifyAdmin, getPost, RemovePost);
router.post("/blog/EditPost", auth, verifyAdmin, getPost, UpdatePost);

export { router as Router };
