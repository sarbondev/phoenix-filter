import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { logger } from '../../shared/utils/logger';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// MIME → file extension. The extension is derived from MIME, NOT from
// file.originalname (which is attacker-controlled).
// SVG is intentionally excluded: it can carry inline <script> and would
// execute as same-origin when served from /uploads.
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = MIME_TO_EXT[file.mimetype];
    if (!ext) return cb(new Error(`Unsupported MIME: ${file.mimetype}`), '');
    const id = crypto.randomBytes(16).toString('hex');
    cb(null, `${Date.now()}-${id}${ext}`);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (MIME_TO_EXT[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed: ${Object.keys(MIME_TO_EXT).join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

export function getFileUrl(filename: string): string {
  return `/uploads/${filename}`;
}

/**
 * Delete a file from the uploads directory by its URL path.
 * Path traversal is prevented by validating the filename has no slashes
 * or parent-directory references.
 */
export function deleteFile(fileUrl: string): void {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  const filename = fileUrl.replace('/uploads/', '');
  // Reject any path traversal attempt: filenames must be a single segment
  // with no separators or relative-path tokens.
  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
    logger.warn({ fileUrl }, 'Refusing to delete: suspicious filename');
    return;
  }
  const filePath = path.join(UPLOAD_DIR, filename);
  // Defense in depth: ensure the resolved path stays inside UPLOAD_DIR.
  if (!filePath.startsWith(UPLOAD_DIR + path.sep) && filePath !== UPLOAD_DIR) {
    logger.warn({ filePath }, 'Refusing to delete: path escaped UPLOAD_DIR');
    return;
  }
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info({ filePath }, 'File deleted');
    }
  } catch (err) {
    logger.warn({ filePath, err }, 'Failed to delete file');
  }
}

export function deleteFiles(fileUrls: string[]): void {
  for (const url of fileUrls) {
    deleteFile(url);
  }
}
