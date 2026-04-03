/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Production: full origin of the API, e.g. https://keygo-api.onrender.com (no trailing slash). Empty in local dev → same-origin /api via Vite proxy. */
  readonly VITE_API_URL?: string
  /** Local dev only: where to proxy /api (default http://127.0.0.1:3000). */
  readonly VITE_DEV_API_PROXY?: string
  /** Mapbox public access token for mapbox-gl (optional until the map is enabled). */
  readonly VITE_MAPBOX_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
