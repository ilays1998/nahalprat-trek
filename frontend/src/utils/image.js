// utils/image.js
// Helper to automatically optimize images via Cloudflare Transformations.
// Works in both local development and production (Cloudflare Pages).

/**
 * Generate a Cloudflare-optimized image URL when in production.
 *
 * @param {string} path - Path to the image (e.g. "/images/hero.jpg")
 * @param {object} options - Optional optimization parameters.
 * @param {number} [options.width=1200]   - Target width in pixels
 * @param {number} [options.quality=75]   - Compression quality (1–100)
 * @param {string} [options.format="auto"] - Format: "auto", "webp", or "avif"
 * @returns {string} - The transformed or original image URL
 */
export function cfImage(path, options = {}) {
  if (!path) return "";

  const {
    width = 1200,
    quality = 75,
    format = "auto",
  } = options;

  // Normalize the path (ensure it starts with "/")
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Automatically detect if we’re on the live site
  const hostname = window.location.hostname;
  const isProduction = hostname.includes("treknahalprat.co.il");

  // In production: use Cloudflare's edge optimization
  if (isProduction) {
    return `/cdn-cgi/image/width=${width},quality=${quality},format=${format}${cleanPath}`;
  }

  // In local development: just return the plain path
  return cleanPath;
}