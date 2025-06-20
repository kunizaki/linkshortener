#!/bin/sh
set -e

echo "Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_INTERVAL=2

for i in $(seq 1 $MAX_RETRIES); do
  npx prisma migrate deploy && break
  echo "Database not ready yet (attempt $i/$MAX_RETRIES). Retrying in ${RETRY_INTERVAL}s..."
  sleep $RETRY_INTERVAL
done

if [ $i -eq $MAX_RETRIES ]; then
  echo "Could not connect to database after $MAX_RETRIES attempts. Exiting."
  exit 1
fi

echo "Database migrations completed successfully!"

# Start the application
exec "$@"