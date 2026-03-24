/**
 * Media Processing Service
 * Handles download and conversion of WhatsApp media files
 * Voice notes: .ogg → .mp3 (via ffmpeg) → ready for Whisper STT
 * Images: download → upload to S3
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { downloadWhatsAppMedia } = require('./whatsapp-api');

// ffmpeg is optional — only needed when processing real voice notes
let ffmpeg;
try {
  ffmpeg = require('fluent-ffmpeg');
} catch (e) {
  console.warn('⚠️ fluent-ffmpeg not available — voice note conversion disabled');
}

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Download media from WhatsApp and save locally
 * @param {string} mediaId - WhatsApp media ID
 * @returns {string} Local file path
 */
async function downloadMedia(mediaId) {
  try {
    const media = await downloadWhatsAppMedia(mediaId);
    const ext = media.mimeType.includes('ogg') ? '.ogg'
      : media.mimeType.includes('image') ? '.jpg'
      : '.bin';

    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filepath, Buffer.from(media.data));
    console.log(`💾 Media saved: ${filename} (${(media.fileSize / 1024).toFixed(1)}KB)`);

    return filepath;
  } catch (error) {
    console.error('Media download failed:', error.message);

    // MOCK MODE: Return a placeholder path
    if (process.env.NODE_ENV === 'development') {
      const mockPath = path.join(UPLOAD_DIR, `mock-${uuidv4()}.ogg`);
      fs.writeFileSync(mockPath, 'MOCK_AUDIO_DATA');
      return mockPath;
    }

    throw error;
  }
}

/**
 * Convert .ogg voice note to .mp3 for Whisper API
 * WhatsApp sends voice notes as Opus-encoded .ogg files
 * Whisper API accepts: .mp3, .mp4, .mpeg, .mpga, .m4a, .wav, .webm
 *
 * @param {string} oggPath - Path to the .ogg file
 * @param {string} messageId - WhatsApp message ID (for naming)
 * @returns {string} Path to the converted .mp3 file
 */
async function convertOggToMp3(oggPath, messageId) {
  const mp3Path = oggPath.replace('.ogg', '.mp3');

  if (!ffmpeg) {
    console.warn('⚠️ ffmpeg not available, returning original file');
    return oggPath;
  }

  return new Promise((resolve, reject) => {
    ffmpeg(oggPath)
      .toFormat('mp3')
      .audioBitrate(64) // Low bitrate is fine for speech
      .audioChannels(1) // Mono
      .audioFrequency(16000) // 16kHz — optimal for speech recognition
      .on('end', () => {
        console.log(`🎵 Converted: ${path.basename(oggPath)} → .mp3`);
        // Clean up original .ogg file
        try { fs.unlinkSync(oggPath); } catch (e) {}
        resolve(mp3Path);
      })
      .on('error', (err) => {
        console.error('FFmpeg conversion error:', err.message);
        reject(err);
      })
      .save(mp3Path);
  });
}

/**
 * Upload image to S3 (or local storage in dev)
 * @param {string} localPath - Local file path
 * @returns {string} Public URL of the uploaded image
 */
async function uploadToS3(localPath) {
  // TODO: Implement actual S3 upload
  // For now, return a local path reference
  const filename = path.basename(localPath);

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID !== 'your_aws_key') {
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    const s3 = new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    const fileContent = fs.readFileSync(localPath);
    const key = `properties/${Date.now()}-${filename}`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: fileContent,
      ContentType: 'image/jpeg'
    }));

    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  // DEV MODE: Return local path
  console.log(`🔧 DEV MODE — Image stored locally: ${filename}`);
  return `/uploads/${filename}`;
}

module.exports = { downloadMedia, convertOggToMp3, uploadToS3 };
