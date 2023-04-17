import upload from "controllers/upload/image";
import { Router } from "express";
import { validateAdmin, validateToken } from "middleware/validate";
import { v2 as cloudinary } from "cloudinary";

const router = Router();
const isAdmin = [validateAdmin];
const isUser = [validateToken];

const uploader = async (path: string) =>
  await cloudinary.uploader.upload(path, {
    folder: "SevenShop/",
  });

router.post(
  "/single",
  isAdmin,
  upload.single("file"),
  async (req: any, res: any, next: any) => {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    const newPath = await uploader(req.file.path);

    res.json({ secure_url: newPath.secure_url });
  }
);

router.post(
  "/multiple",
  isUser,
  upload.array("files", 10),
  async (req: any, res: any, next: any) => {
    if (!req.files) {
      next(new Error("No file uploaded!"));
      return;
    }

    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath.secure_url);
    }
    res.json({ secure_urls: urls });
  }
);

export default router;
