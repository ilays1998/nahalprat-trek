# Nahal Prat Trek Backend

## Prerequisites
 - Python 3.10+ installed
- PostgreSQL installed and running (default user: `postgres`, db: `nahalprat`)
- (Create the DB: `createdb -U postgres nahalprat`)

## Setup

1. **Create virtualenv & install dependencies**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. **Create `.env`**
   ```bash
   cp .env_example .env
   ```
   Set values, for example:
   ```env
   SQLALCHEMY_DATABASE_URI=postgresql://postgres:YOUR_PASSWORD@localhost:5432/nahalprat
   SECRET_KEY=dev_secret
   JWT_SECRET_KEY=dev_jwt_secret
   FRONTEND_URL=http://localhost:3000
   BACKEND_PORT=5001
   FLASK_APP=app:create_app
   ```
3. **Initialize database**
   ```bash
   createdb -U postgres nahalprat  # if not created yet
   flask db upgrade
   ```
4. **Run in development**
   ```bash
   python app.py
   ```
   The server runs at `http://localhost:5001` (configurable via `BACKEND_PORT`).

## Useful commands

- Run migrations: `flask db migrate -m "message" && flask db upgrade`
- Open Python shell with app context:
  ```bash
  FLASK_APP=app:create_app flask shell
  ```

## Notes

- CORS origins are derived from `CORS_ORIGINS` or `FRONTEND_URL`.
- OAuth (Google) requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`.
- In production, the app is served by Gunicorn and runs DB migrations on start (see `docker-entrypoint.sh`).
