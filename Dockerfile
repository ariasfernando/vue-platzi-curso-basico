##
# Please do not touch this file unless you are sure
# what you are doing.
#
# Multi-stage builds are a new feature requiring Docker 17.05 or higher on the daemon and client. 
##

ARG BUILDER_TAG
ARG RUNTIME_TAG

# ---- Build Tools Image ----
FROM registry.stensuldev.net/dockerfiles/stensul/builder:$BUILDER_TAG AS builder

# ---- Build Process ----
FROM builder AS build_process

ARG DOCKER_BUILDING
ARG APP_NAME
ARG NODE_ENV=production

# ---- PHP Dependencies ----
COPY ./composer.json /usr/src/app/composer.json
COPY ./composer.lock /usr/src/app/composer.lock
COPY ./database /usr/src/app/database
COPY ./tests /usr/src/app/tests

# Install composer packages
RUN composer install --no-scripts

# ---- Node Dependencies ----
COPY ./package.json /usr/src/app/package.json
COPY ./package-lock.json /usr/src/app/package-lock.json
# Install node packages
RUN npm install

# Copy source code 
COPY . /usr/src/app/

    # Run artisan vendor:publish --all copy assets from composer packages.
RUN php artisan vendor:publish --all \
    # Run Webpack production
    && npm run production \
    && rm -fr node_modules
#
# ---- Build Release ----

FROM registry.stensuldev.net/dockerfiles/stensul/runtime:$RUNTIME_TAG AS release

# Copy built aplication files to runtime image.
COPY --chown=32003:32005 --from=build_process /usr/src/app/ /usr/src/app/
