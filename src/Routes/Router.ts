import { Router, Request, Response } from "express";
import { GetPosts, CreatePost, RemovePost, UpdatePost } from "../blog/BlogController";
import { getPost, auth, verifyAdmin, largeLimiter, upload } from "../Middleware";
const router = Router();

router.get("/blog/health", auth, (req: Request, res: Response) =>
  res.status(200).json({ Status: "Success", message: "Blog service is Healthy" })
);

router.get("/blog/posts", auth, largeLimiter, GetPosts);
router.post("/blog/createpost", auth, verifyAdmin, upload.single("file"), CreatePost);
router.post("/blog/removepost", auth, verifyAdmin, getPost, RemovePost);
router.post("/blog/editpost", auth, verifyAdmin, getPost, UpdatePost);

export { router as Router };
