# Nahal Prat Trek

## 🌐 Live Website
[Visit Nahal Prat Trek](https://www.treknahalprat.co.il)

Booking and information app for guided treks at Nahal Prat.

This is a monorepo with a Flask/PostgreSQL backend and a React (Vite + Tailwind) frontend.

## Repository layout

```
backend/   # Flask API, DB models and migrations, Render/Docker entrypoint
frontend/  # React + Vite SPA, Tailwind CSS
render.yaml# Render Blueprint to deploy backend, frontend, and Postgres
```

## Tech stack

- Backend: Flask, SQLAlchemy, Flask-Migrate, JWT, OAuth (Google), Gunicorn
- DB: PostgreSQL
- Frontend: React 18, Vite 6, Tailwind CSS

## Quickstart (local development)

Prerequisites:
- Python 3.10+ (3.11 recommended)
- Node.js 18+ (20 recommended) and npm
- PostgreSQL running locally

### 1) Backend (API)

1. Create and configure your `.env` from the example:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   cp .env_example .env
   pip install -r requirements.txt
   ```
2. Set DB connection in `.env` (example for a local DB):
   ```
   SQLALCHEMY_DATABASE_URI=postgresql://postgres:YOUR_PASSWORD@localhost:5432/nahalprat
   FRONTEND_URL=http://localhost:3000
   BACKEND_PORT=5001
   FLASK_APP=app:create_app
   ```
3. Create DB and run migrations:
   ```bash
   createdb -U postgres nahalprat  # or create via your preferred tool
   flask db upgrade
   ```
4. Start the API:
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5001/api` by default.

### 2) Frontend (SPA)

1. In another terminal:
   ```bash
   cd frontend
   npm ci
   cp .env_example .env  # optional; defaults are fine for local dev
   ```
2. Start the dev server:
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000` and will call the API at `http://localhost:5001` by default.

## Environment variables

### Backend (`backend/.env`)
- `SECRET_KEY`, `JWT_SECRET_KEY`
- `SQLALCHEMY_DATABASE_URI` (Postgres connection string)
- `FRONTEND_URL` (default `http://localhost:3000`)
- `BACKEND_PORT` (default `5001`)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAIL`
- `FLASK_APP=app:create_app` (for Flask CLI commands like migrations)
- `SMTP_SERVER`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` (for email sending)
- `CONTACT_EMAIL` (recipient for contact forms)

### Frontend (`frontend/.env`)
- `VITE_BACKEND_URL` (explicit full backend URL, e.g. `http://localhost:5001`)
- `VITE_BACKEND_HOST` (used on Render; backend host becomes `https://<host>`)
- `VITE_BACKEND_PORT` (default `5001`)
- `VITE_FRONTEND_PORT` (default `3000`)

## Deployment

### Deploy on Render (recommended)

This repo includes a Render Blueprint (`render.yaml`) that provisions:
- Web Service: Backend (Flask + Gunicorn)
- Managed PostgreSQL database

Steps:
1. Push the repository to GitHub.
2. In Render, create a new Blueprint and point it at your repo.
3. Provide the required environment variables for the backend service:
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAIL`
   - Other secrets can be auto-generated or inherited from the database connection.
4. Render will build and start the backend service. Database migrations are executed on boot via the backend start command.

After deployment:
- Backend will be served at the backend Render URL.

### Frontend Deployment

The frontend is hosted through Cloudflare and is accessible at `https://www.treknahalprat.co.il`. Ensure the `VITE_BACKEND_URL` in the frontend `.env` points to the backend's deployed URL.

### Deploy with Docker (manual option)

Build and run the backend:
```bash
docker build -t nahalprat-backend ./backend
docker run --rm \
  -p 8000:8000 \
  --env-file backend/.env \
  -e PORT=8000 \
  nahalprat-backend
```

Build and run the frontend (serves the built `dist/`):
```bash
docker build -t nahalprat-frontend ./frontend
docker run --rm \
  -p 3000:3000 \
  -e PORT=3000 \
  nahalprat-frontend
```

Notes:
- Ensure your backend `.env` points at a reachable Postgres instance from inside the container (e.g., a Docker network or a managed DB).
- The backend container runs `flask db upgrade` automatically on start.

## Additional Features

### Email Sending
The backend is configured to send emails using Gmail SMTP. Ensure the following environment variables are set in `backend/.env`:
- `SMTP_SERVER`, `SMTP_PORT`
- `SMTP_USERNAME`, `SMTP_PASSWORD`

Follow the instructions in `.env_example` to enable Gmail App Passwords for secure email sending.

### User Login Cookies
The application uses cookies to keep users logged in. Ensure your browser settings allow cookies for the domain `https://www.treknahalprat.co.il` to maintain session persistence.

# All rights reserved © 2025

All Rights Reserved License

Copyright (c) 2025 Ilays

All rights reserved. No part of this software may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the copyright owner, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.

