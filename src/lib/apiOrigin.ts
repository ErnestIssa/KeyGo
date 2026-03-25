/**
 * Public API origin (no trailing slash).
 * - Development: empty → requests use `/api` and Vite proxies to the backend (see vite.config).
 * - Production: set `VITE_API_URL` at build time (e.g. `https://your-api.onrender.com`).
 */
export function getApiOrigin(): string {
  const raw = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? ''
  if (raw) return raw.replace(/\/$/, '')

  if (import.meta.env.PROD) {
    console.warn(
      '[KeyGo] VITE_API_URL is not set. Production builds need VITE_API_URL (your API origin, no trailing slash). Requests will fall back to same-origin /api and usually fail on static hosting.'
    )
  }
  return ''
}
