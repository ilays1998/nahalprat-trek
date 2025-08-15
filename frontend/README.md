# Nahal Prat Trek Frontend

React 18 + Vite + Tailwind SPA.

## Prerequisites
- Node.js 18+ (20 recommended)
- npm 9+

## Setup & Run (development)

```bash
cd frontend
npm ci
cp .env_example .env  # optional for local dev; default ports work
npm start             # starts Vite dev server on http://localhost:3000
```

By default the app calls the backend at `http://localhost:5001`.

### Environment variables (`.env`)

- `VITE_BACKEND_URL` (overrides backend URL entirely, e.g. `http://localhost:5001`)
- `VITE_BACKEND_HOST` (used in Render; becomes `https://<host>`)
- `VITE_BACKEND_PORT` (default `5001`)
- `VITE_FRONTEND_PORT` (default `3000`)

### Build & Preview (local)

```bash
npm run build
npm run preview -- --host --port 3000
```

### Production build output

Built files are emitted to `dist/` and can be served by any static host.