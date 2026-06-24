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

RUN touch /app/database/database.sqlite

# Create .env
RUN cp .env.example .env && \
    sed -i 's|DB_CONNECTION=.*|DB_CONNECTION=sqlite|' .env && \
    sed -i 's|# DB_DATABASE=.*|DB_DATABASE=/app/database/database.sqlite|' .env

RUN php artisan key:generate --force
RUN php artisan migrate --force

# Set permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache /app/database

# Nginx config
RUN echo 'server { \
    listen ${PORT:-8000}; \
    root /app/public; \
    index index.php; \
    location / { try_files $uri $uri/ /index.php?$query_string; } \
    location ~ \.php$ { \
        fastcgi_pass 127.0.0.1:9000; \
        fastcgi_index index.php; \
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name; \
        include fastcgi_params; \
    } \
}' > /etc/nginx/sites-available/default

EXPOSE 8000

CMD bash -c "php-fpm -D && nginx -g 'daemon off;'"
