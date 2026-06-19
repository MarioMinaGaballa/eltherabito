import { ORIGIN } from '../services/apiConfig';

/**
 * Build a usable <img src> from whatever the backend returns.
 *
 * The API is inconsistent: some DTOs return a full relative path
 * ("/images/doctors/abc.jpeg"), others return just a filename
 * ("abc.jpeg"). Images are served from the server ROOT, not under /api.
 *
 * @param {string|null|undefined} value  raw value from the API
 * @param {string} folder                'doctors' | 'patients' (used only for bare filenames)
 * @param {string} [fallback]            returned when value is empty
 * @returns {string} absolute image URL (or the fallback)
 */
export function imageUrl(value, folder, fallback = '') {
  if (!value) return fallback;

  // Already an absolute URL — use as-is.
  if (/^https?:\/\//i.test(value)) return value;

  // Full relative path like "/images/doctors/abc.jpeg" — just prefix the origin.
  if (value.startsWith('/')) return `${ORIGIN}${value}`;
  if (value.startsWith('images/')) return `${ORIGIN}/${value}`;

  // Bare filename — build the full path under the given folder.
  return `${ORIGIN}/images/${folder}/${value}`;
}
