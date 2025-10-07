// src/uploads.config.ts
import { join, extname, normalize, relative } from 'path';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

// Root comes from compose: UPLOAD_DIR=/app/uploads (a persisted volume)
export const UPLOAD_ROOT =
  process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');

export const THUMB_DIR = join(UPLOAD_ROOT, 'thumbnails');
export const GALLERY_DIR = join(UPLOAD_ROOT, 'galleries');

export function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

export function safeFilename(originalname: string) {
  const ext = extname(originalname || '').toLowerCase();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return `${Date.now()}-${uuid()}${ext}`;
}

// Store relative path (portable if you later move the root)
export function toRelative(p: string) {
  const rel = relative(UPLOAD_ROOT, normalize(p));
  return rel.replace(/\\/g, '/'); // windows safety
}

// Optional: build public URL (served by main.ts at /uploads)
export function toPublicUrl(relPath: string) {
  const base = process.env.PUBLIC_UPLOAD_BASE_URL || ''; // e.g., https://api.dev.novavoya.com
  return `${base}/uploads/${relPath}`;
}
