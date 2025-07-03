import { S3Client, PutObjectCommand, DeleteObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import * as crypto from "crypto";
import * as path from "path";

// S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "moj-article-images";
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL || "";

class S3Service {
  /**
   * Upload an image to S3
   * @param file - The file buffer to upload
   * @param originalName - Original filename
   * @param folder - S3 folder (e.g., 'articles', 'pastors')
   * @returns Promise with the S3 URL
   */
  async uploadImage(
    file: Buffer,
    originalName: string,
    folder: string = "articles"
  ): Promise<string> {
    try {
      // Generate unique filename
      const fileExtension = path.extname(originalName);
      const fileName = `${folder}/${crypto.randomUUID()}${fileExtension}`;

      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: file,
        ContentType: this.getContentType(fileExtension),
        ACL: ObjectCannedACL.public_read, // Make the image publicly accessible
      };

      const upload = new Upload({
        client: s3Client,
        params: uploadParams,
      });

      const result = await upload.done();
      
      // Return CloudFront URL if available, otherwise S3 URL
      if (CLOUDFRONT_URL) {
        return `${CLOUDFRONT_URL}/${fileName}`;
      }
      
      return `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw new Error("Failed to upload image to S3");
    }
  }

  /**
   * Delete an image from S3
   * @param imageUrl - The full S3 or CloudFront URL
   * @returns Promise<void>
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract the key from the URL
      const key = this.extractKeyFromUrl(imageUrl);
      
      if (!key) {
        throw new Error("Invalid image URL");
      }

      const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: key,
      };

      await s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      console.error("Error deleting from S3:", error);
      throw new Error("Failed to delete image from S3");
    }
  }

  /**
   * Get content type based on file extension
   * @param extension - File extension
   * @returns MIME type string
   */
  private getContentType(extension: string): string {
    const mimeTypes: { [key: string]: string } = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
    };

    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
  }

  /**
   * Extract S3 key from URL
   * @param url - S3 or CloudFront URL
   * @returns S3 key or null
   */
  private extractKeyFromUrl(url: string): string | null {
    try {
      // Handle CloudFront URLs
      if (CLOUDFRONT_URL && url.startsWith(CLOUDFRONT_URL)) {
        return url.replace(`${CLOUDFRONT_URL}/`, "");
      }
      
      // Handle S3 URLs
      if (url.includes(".s3.amazonaws.com/")) {
        return url.split(".s3.amazonaws.com/")[1];
      }
      
      // Handle s3:// URLs
      if (url.startsWith("s3://")) {
        return url.replace(`s3://${BUCKET_NAME}/`, "");
      }

      return null;
    } catch (error) {
      console.error("Error extracting key from URL:", error);
      return null;
    }
  }

  /**
   * Validate if file is an image
   * @param mimetype - File MIME type
   * @returns boolean
   */
  isValidImageType(mimetype: string): boolean {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    return allowedTypes.includes(mimetype);
  }

  /**
   * Validate file size (max 5MB)
   * @param size - File size in bytes
   * @returns boolean
   */
  isValidFileSize(size: number): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return size <= maxSize;
  }
}

export default new S3Service(); 