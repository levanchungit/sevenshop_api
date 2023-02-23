const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any) => {
    return {
      folder: "SevenShop",
      // format: async (req, file) => "png", // supports promises as well
      public_id: req.params.id,
    };
  },
});

export const upload = multer({ storage: storage });
