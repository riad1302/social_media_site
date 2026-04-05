#!/bin/sh
set -e

# Generate app key if missing (docker-compose env vars override .env values at runtime)
php artisan key:generate --force

# Run migrations
php artisan migrate --force

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisord.conf
