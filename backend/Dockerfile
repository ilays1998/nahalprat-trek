FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install build deps only if needed (psycopg2-binary should not require)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

# Entrypoint runs migrations then starts gunicorn
RUN chmod +x docker-entrypoint.sh

EXPOSE 8000

ENV PORT=8000 \
    FLASK_APP=app:create_app

CMD ["./docker-entrypoint.sh"]


