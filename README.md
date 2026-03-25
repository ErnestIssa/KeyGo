# KeyGo (frontend)

React + Vite app: owners post **vehicle** moves; drivers accept and complete relocation. Not a taxi — no passenger transport in scope.

## Environment

| Variable | When |
|----------|------|
| `VITE_API_URL` | **Production:** full origin of the API, e.g. `https://keygo-api.onrender.com` (no trailing slash). **Local dev:** leave empty — the app calls `/api` and Vite proxies to your backend. |
| `VITE_DEV_API_PROXY` | Optional. Default `http://127.0.0.1:3000` — proxy target for `/api` in `npm run dev` / `vite preview`. |

See `.env.example`.

## Scripts

```bash
npm install
npm run dev       # Vite dev server
npm run build     # production assets in dist/
npm run preview   # serve dist/ locally
```

## Deploy (e.g. Render Static Site)

1. Set **Build command:** `npm install && npm run build`  
2. **Publish directory:** `dist`  
3. Add **environment variable** `VITE_API_URL` pointing at your deployed API **before** build (same value as `https://<your-backend>.onrender.com`, no trailing slash). Vite inlines env at build time.

## Backend CORS (Render API)

Set on the **API** service:

- `CORS_ORIGIN` — your **frontend** origin(s), comma-separated (e.g. `https://your-app.onrender.com`).
- Optional: `CORS_INCLUDE_LOCALHOST=true` — also allow `http://localhost:5173` and `http://localhost:4173` when testing the deployed API from local Vite/preview while `CORS_ORIGIN` is set.

## Local full stack

1. Start MongoDB and the API (`KeyGo_Server`, `npm run dev`).  
2. Start this app (`npm run dev`).  
3. Open the URL Vite prints (e.g. `http://localhost:5173`).
