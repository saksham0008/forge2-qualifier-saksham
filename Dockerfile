FROM php:8.4-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libsqlite3-dev nginx \
    && docker-php-ext-install pdo pdo_sqlite \
    && apt-get clean

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# cache-bust: v5
COPY backend/ .

RUN composer install --no-dev --optimize-autoloader

# Create .env with all safe settings
RUN cp .env.example .env
RUN sed -i 's|APP_ENV=.*|APP_ENV=production|' .env
RUN sed -i 's|APP_DEBUG=.*|APP_DEBUG=false|' .env
RUN sed -i 's|DB_CONNECTION=.*|DB_CONNECTION=sqlite|' .env
RUN sed -i 's|SESSION_DRIVER=.*|SESSION_DRIVER=file|' .env
RUN sed -i 's|CACHE_STORE=.*|CACHE_STORE=array|' .env
RUN sed -i 's|QUEUE_CONNECTION=.*|QUEUE_CONNECTION=sync|' .env
RUN sed -i 's|LOG_CHANNEL=.*|LOG_CHANNEL=stderr|' .env
RUN echo 'DB_DATABASE=/app/database/database.sqlite' >> .env

RUN php artisan key:generate --force
RUN php artisan config:clear
RUN touch /app/database/database.sqlite
RUN php artisan migrate --force

# Create all required Laravel storage directories
RUN mkdir -p /app/storage/framework/sessions \
    /app/storage/framework/views \
    /app/storage/framework/cache/data \
    /app/storage/logs \
    /app/bootstrap/cache

# Permissions
RUN chmod -R 777 /app/storage
RUN chmod -R 777 /app/bootstrap/cache
RUN chmod -R 777 /app/database
RUN chown -R www-data:www-data /app

# Nginx config
COPY nginx.conf /etc/nginx/sites-available/default

EXPOSE 8000

CMD bash -c "php-fpm -D && nginx -g 'daemon off;'"
