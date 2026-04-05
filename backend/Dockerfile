FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    zip \
    gd \
    pcntl \
    bcmath

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first for layer caching
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist

# Copy application code
COPY . .

# Complete composer install
RUN composer dump-autoload --optimize

# .env is copied directly from the repo (DB_HOST points to the mysql service)

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Supervisor config
COPY docker/supervisord.conf /etc/supervisord.conf

# Entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
