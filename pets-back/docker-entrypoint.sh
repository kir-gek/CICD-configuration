#!/bin/sh

set -eu

echo "Applying database migrations..."
npm run db:migrate

if [ "${RUN_SEEDS:-false}" = "true" ]; then
  echo "Applying beta seed data..."
  npm run db:seed
else
  echo "Seed data is disabled."
fi

echo "Starting backend..."
exec npm start