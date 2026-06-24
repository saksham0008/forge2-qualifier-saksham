FROM php:8.4-cli

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite \
    && apt-get clean

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY backend/ .

RUN composer install --no-dev --optimize-autoloader

RUN touch /app/database/database.sqlite

# Create .env from example and set required values
RUN cp .env.example .env && \
    sed -i 's|DB_CONNECTION=.*|DB_CONNECTION=sqlite|' .env && \
    sed -i 's|# DB_DATABASE=.*|DB_DATABASE=/app/database/database.sqlite|' .env

RUN php artisan key:generate --force
RUN php artisan migrate --force

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
