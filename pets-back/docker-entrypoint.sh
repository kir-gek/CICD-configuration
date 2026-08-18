#!/bin/sh

set -eu

echo "Applying database migrations..."
npm run db:migrate

echo "Starting backend..."
exec npm start