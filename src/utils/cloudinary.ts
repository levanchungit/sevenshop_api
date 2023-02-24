import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "dotenv";
import multer from "multer";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// export async function uploadToCloudinary(locaFilePath: any) {
//   var mainFolderName = "SevenShop";
//   return cloudinary.uploader
//     .upload(locaFilePath, { folder: mainFolderName })
//     .then((result: any) => {
//       console.log("RS", result);
//       return result.url;
//     })
//     .catch((error: any) => {
//       return { message: error };
//     });
// }

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any) => {
    console.log(req);
    return {
      folder: "SevenShop",
      public_id: req.params.id,
    };
  },
});

export const upload = multer({
  storage: storage,
});
