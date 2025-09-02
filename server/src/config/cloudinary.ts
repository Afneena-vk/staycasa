

import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
   
    return {
      folder: "staycasa/owner-documents",
      resource_type: "auto", 
    
      public_id:
        Date.now() +
        "-" +
        file.originalname
          .toLowerCase()
          .replace(/\.[^/.]+$/, "")
          .replace(/\s+/g, "-")
          .slice(0, 80),
    };
  },
});


const allowed = ["image/jpeg", "image/png", "application/pdf"];
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error("Only JPG, PNG, and PDF files are allowed"));
};

export const cloudinaryUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024}, 
});

export { cloudinary };
