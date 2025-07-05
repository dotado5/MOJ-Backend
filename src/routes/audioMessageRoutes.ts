import { Router } from "express";
import { body } from "express-validator";
import AudioMessageController from "../controllers/AudioMessageController";
import { AUDIO_MESSAGE_CATEGORIES } from "../constants/audioMessage";
import multer from "multer";

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for audio files
  },
  fileFilter: (req, file, cb) => {
    console.log("Multer file filter:", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    
    // Allow audio files for the 'audio' field
    if (file.fieldname === "audio") {
      if (file.mimetype.startsWith("audio/")) {
        console.log("Multer: Audio file accepted");
        cb(null, true);
      } else {
        console.log("Multer: Audio file rejected, mimetype:", file.mimetype);
        cb(new Error(`Only audio files are allowed for the audio field. Received: ${file.mimetype}`));
      }
    }
    // Allow image files for the 'thumbnail' field
    else if (file.fieldname === "thumbnail") {
      if (file.mimetype.startsWith("image/")) {
        console.log("Multer: Image file accepted");
        cb(null, true);
      } else {
        console.log("Multer: Image file rejected, mimetype:", file.mimetype);
        cb(new Error(`Only image files are allowed for the thumbnail field. Received: ${file.mimetype}`));
      }
    } else {
      console.log("Multer: Unexpected field:", file.fieldname);
      cb(new Error(`Unexpected field: ${file.fieldname}`));
    }
  },
});

// Validation middleware
const validateAudioMessage = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Description must be between 1 and 1000 characters"),
  body("speaker")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Speaker name must be between 1 and 100 characters"),
  body("category")
    .isIn([...AUDIO_MESSAGE_CATEGORIES])
    .withMessage(`Category must be one of: ${AUDIO_MESSAGE_CATEGORIES.join(", ")}`),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be in valid ISO format (YYYY-MM-DD)"),
  body("duration")
    .optional()
    .matches(/^(\d{1,2}:)?[0-5]?\d:[0-5]\d$/)
    .withMessage("Duration must be in format MM:SS or H:MM:SS"),
];

// Routes

/**
 * GET /audio-messages/categories
 * Get available audio message categories
 */
router.get("/categories", AudioMessageController.getCategories);

/**
 * GET /audio-messages
 * Get all audio messages with pagination, filtering, and search
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - category: string (filter by category)
 * - speaker: string (filter by speaker)
 * - search: string (search in title, description, speaker)
 */
router.get("/", AudioMessageController.getAllAudioMessages);

/**
 * GET /audio-messages/latest
 * Get latest audio messages
 * Query params:
 * - limit: number (default: 5)
 */
router.get("/latest", AudioMessageController.getLatestAudioMessages);

/**
 * GET /audio-messages/popular
 * Get popular audio messages (sorted by play count)
 * Query params:
 * - limit: number (default: 10)
 */
router.get("/popular", AudioMessageController.getPopularAudioMessages);

/**
 * GET /audio-messages/category/:category
 * Get audio messages by category
 * Params:
 * - category: string (category name)
 * Query params:
 * - limit: number (default: 10)
 */
router.get("/category/:category", AudioMessageController.getAudioMessagesByCategory);

/**
 * GET /audio-messages/:id
 * Get a single audio message by ID
 * Params:
 * - id: string (audio message ID)
 */
router.get("/:id", AudioMessageController.getAudioMessageById);

/**
 * POST /audio-messages
 * Create a new audio message
 * Body: multipart/form-data
 * - title: string (required)
 * - description: string (required)
 * - speaker: string (required)
 * - category: string (required)
 * - duration: string (optional, format: MM:SS or H:MM:SS)
 * - audio: file (required, audio file)
 * - thumbnail: file (optional, image file)
 */
router.post(
  "/",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validateAudioMessage,
  AudioMessageController.createAudioMessage
);

/**
 * PUT /audio-messages/:id
 * Update an audio message
 * Params:
 * - id: string (audio message ID)
 * Body: multipart/form-data
 * - title: string (required)
 * - description: string (required)
 * - speaker: string (required)
 * - category: string (required)
 * - duration: string (optional, format: MM:SS or H:MM:SS)
 * - audio: file (optional, audio file - replaces existing)
 * - thumbnail: file (optional, image file - replaces existing)
 */
router.put(
  "/:id",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validateAudioMessage,
  AudioMessageController.updateAudioMessage
);

/**
 * DELETE /audio-messages/:id
 * Delete an audio message
 * Params:
 * - id: string (audio message ID)
 */
router.delete("/:id", AudioMessageController.deleteAudioMessage);

/**
 * POST /audio-messages/:id/play
 * Increment play count for an audio message
 * Params:
 * - id: string (audio message ID)
 */
router.post("/:id/play", AudioMessageController.incrementPlayCount);

export default router; 