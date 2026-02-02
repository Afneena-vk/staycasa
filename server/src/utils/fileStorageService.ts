import { v2 as cloudinary } from "cloudinary";

export class FileStorageService {

  static async upload(file: Express.Multer.File) {
    if (!file) throw new Error("No file provided for upload");

    return {
      url: file.path,          
      publicId: file.filename,
    };
  }

  
  static async delete(publicId: string) {
    if (!publicId) return;

    try {
    const result =  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

      console.log(`Cloudinary delete result for ${publicId}:`, result);


      if (result.result !== "ok" && result.result !== "not_found") {
        console.warn(`Warning: deletion may not have succeeded for ${publicId}`);
      }

      
    } catch (error) {
      console.error("Cloudinary delete error:", error);
    }
  }


  static async deleteMultiple(publicIds: string[]) {
    if (!publicIds || publicIds.length === 0) return;

    for (const id of publicIds) {
      await this.delete(id);
    }
  }
}
