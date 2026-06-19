/**
 * Central API configuration — single source of truth for the backend.
 * Every service imports from here so the base URL, server origin, token
 * key, and auth headers stay consistent across the app.
 */

/** Server origin (no /api) — used for static assets like /images/... */
export const ORIGIN = 'https://mentalhealth01.runasp.net';

/** API base — used for all /api/... endpoints. */
export const BASE_URL = `${ORIGIN}/api`;

/** localStorage key where AuthContext stores the bearer token. */
export const TOKEN_KEY = 'eltherabito-token';

/** Read the stored bearer token (or null if logged out). */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Standard JSON auth headers. Pass { json: false } for multipart/FormData
 * requests so the browser can set its own Content-Type boundary.
 */
export function getAuthHeaders({ json = true } = {}) {
  const token = getToken();
  return {
    ...(json && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}
