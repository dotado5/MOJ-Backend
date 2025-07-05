import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
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
   * Upload a file to S3 (images, audio, etc.)
   * @param file - The file buffer to upload
   * @param originalName - Original filename
   * @param folder - S3 folder (e.g., 'articles', 'pastors', 'audio')
   * @returns Promise with the S3 URL
   */
  async uploadFile(
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
        // Removed ACL setting - bucket uses bucket policy instead
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
      // Image types
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      // Audio types
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".wave": "audio/wav",
      ".m4a": "audio/m4a",
      ".mp4": "audio/mp4",
      ".aac": "audio/aac",
      ".ogg": "audio/ogg",
      ".oga": "audio/ogg",
      ".flac": "audio/flac",
      ".opus": "audio/opus",
      ".webm": "audio/webm",
      ".3gp": "audio/3gpp",
      ".3g2": "audio/3gpp2",
      ".amr": "audio/amr",
      ".mid": "audio/midi",
      ".midi": "audio/midi",
      ".wma": "audio/wma",
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
   * Validate if file is an audio file
   * @param mimetype - File MIME type
   * @returns boolean
   */
  isValidAudioType(mimetype: string): boolean {
    const allowedTypes = [
      // Standard audio types
      "audio/mpeg",        // MP3
      "audio/mp3",         // MP3 (alternative)
      "audio/wav",         // WAV
      "audio/wave",        // WAV (alternative)
      "audio/x-wav",       // WAV (alternative)
      "audio/m4a",         // M4A
      "audio/mp4",         // M4A/MP4 audio
      "audio/aac",         // AAC
      "audio/x-aac",       // AAC (alternative)
      "audio/ogg",         // OGG
      "audio/vorbis",      // OGG Vorbis
      "audio/flac",        // FLAC
      "audio/x-flac",      // FLAC (alternative)
      "audio/webm",        // WebM audio
      "audio/opus",        // Opus
      "audio/3gpp",        // 3GP audio
      "audio/3gpp2",       // 3G2 audio
      "audio/amr",         // AMR
      "audio/basic",       // Basic audio
      "audio/mid",         // MIDI
      "audio/midi",        // MIDI
      "audio/x-midi",      // MIDI (alternative)
      "audio/wma",         // Windows Media Audio
      "audio/x-ms-wma",    // Windows Media Audio (alternative)
      // Additional common types that browsers might report
      "audio/x-m4a",       // M4A (alternative)
      "audio/mp4a-latm",   // M4A (MPEG-4 audio)
      "audio/mpeg4-generic", // M4A (alternative)
    ];
    
    const normalizedMimetype = mimetype.toLowerCase();
    const isValid = allowedTypes.includes(normalizedMimetype);
    
    // Debug logging
    console.log("Audio validation:", {
      mimetype: mimetype,
      normalized: normalizedMimetype,
      isValid: isValid,
      allowedTypes: allowedTypes.filter(type => type.includes('m4a') || type.includes('mp4'))
    });
    
    return isValid;
  }

  /**
   * Validate file size for images (max 5MB)
   * @param size - File size in bytes
   * @returns boolean
   */
  isValidImageSize(size: number): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return size <= maxSize;
  }

  /**
   * Validate file size for audio (max 100MB)
   * @param size - File size in bytes
   * @returns boolean
   */
  isValidAudioSize(size: number): boolean {
    const maxSize = 100 * 1024 * 1024; // 100MB
    return size <= maxSize;
  }

  /**
   * Legacy method for backward compatibility
   * @param size - File size in bytes
   * @returns boolean
   */
  isValidFileSize(size: number): boolean {
    return this.isValidImageSize(size);
  }

  /**
   * Legacy method for backward compatibility
   * @param file - The file buffer to upload
   * @param originalName - Original filename
   * @param folder - S3 folder
   * @returns Promise with the S3 URL
   */
  async uploadImage(
    file: Buffer,
    originalName: string,
    folder: string = "articles"
  ): Promise<string> {
    return this.uploadFile(file, originalName, folder);
  }
}

export default new S3Service(); 