import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "dotenv";

config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req: any) => {
    return {
      public_id: req.params.id,
      use_filename: true,
      width: 1200,
      height: 800,
      crop: "limit",
      quantity: "auto:best",
    };
  },
});

const upload = multer({ storage: cloudinaryStorage });

export default upload;
