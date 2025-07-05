export const AUDIO_MESSAGE_CATEGORIES = [
  "Sermons",
  "Youth", 
  "Worship",
  "Teaching",
  "Prayer"
] as const;

export type AudioMessageCategory = typeof AUDIO_MESSAGE_CATEGORIES[number];

export const AUDIO_MESSAGE_DEFAULTS = {
  DEFAULT_CATEGORY: "Sermons" as AudioMessageCategory,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_SPEAKER_LENGTH: 100,
  MAX_AUDIO_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_THUMBNAIL_SIZE: 5 * 1024 * 1024, // 5MB
} as const; 