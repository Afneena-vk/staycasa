// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config(); // ✅ loads .env file

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });

// console.log("Cloudinary connected:", cloudinary.config().cloud_name);

// export default cloudinary;

// src/config/cloudinary.ts

import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Storage engine that uploads to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    // Keep it flexible: allow images and pdfs
    return {
      folder: "staycasa/owner-documents",
      resource_type: "auto", // allows pdf, images, etc.
      // readable unique id
      public_id:
        Date.now() +
        "-" +
        file.originalname
          .toLowerCase()
          .replace(/\.[^/.]+$/, "") // remove extension
          .replace(/\s+/g, "-")
          .slice(0, 80),
    };
  },
});

// Restrict file types + size (optional but recommended)
const allowed = ["image/jpeg", "image/png", "application/pdf"];
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error("Only JPG, PNG, and PDF files are allowed"));
};

export const cloudinaryUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024}, // 5 MB/file, max 5 files
});

export { cloudinary };
