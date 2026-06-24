FROM php:8.4-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libsqlite3-dev nginx \
    && docker-php-ext-install pdo pdo_sqlite \
    && apt-get clean

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY backend/ .

RUN composer install --no-dev --optimize-autoloader

# Create .env
RUN cp .env.example .env && \
    sed -i 's|DB_CONNECTION=.*|DB_CONNECTION=sqlite|' .env && \
    sed -i 's|# DB_DATABASE=.*|DB_DATABASE=/app/database/database.sqlite|' .env && \
    sed -i 's|APP_DEBUG=.*|APP_DEBUG=true|' .env

RUN php artisan key:generate --force

# Create and seed the database
RUN touch /app/database/database.sqlite && \
    php artisan migrate --force

# Permissions
RUN chmod -R 777 /app/storage /app/bootstrap/cache /app/database

# Nginx config
COPY nginx.conf /etc/nginx/sites-available/default

EXPOSE 8000

CMD bash -c "php-fpm -D && nginx -g 'daemon off;'"
