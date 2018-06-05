##
# Please do not touch this file unless you are sure
# what you are doing
#
# Multi-stage builds are a new feature requiring Docker 17.05 or higher on the daemon and client. 
##

#
# ---- Base ----
FROM registry.stensuldev.net/dockerfiles/web-2.0.0:2.2.0 AS base

# set working directory
WORKDIR /usr/src/app/

# enable opcache heavily
COPY ./conf.d/php/10-opcache.ini /etc/php.d/

#
# ---- Build Composer Dependencies ----
FROM base AS composer_dependencies

COPY ./composer.json /usr/src/app/composer.json
COPY ./composer.lock /usr/src/app/composer.lock
COPY ./database /usr/src/app/database
COPY ./tests /usr/src/app/tests
COPY ./artisan /usr/src/app/artisan

RUN cd /usr/src/app/ && composer install --no-scripts

#
# ---- Build Node Dependencies ----
FROM base AS npm_dependencies

# install node packages
ARG NODE_ENV=production

COPY ./package.json /usr/src/app/package.json
COPY ./package-lock.json /usr/src/app/package-lock.json
RUN cd /usr/src/app/ && npm install

# copy production node_modules aside
RUN cp -R node_modules prod_node_modules

#
# ---- Build Release ----
FROM base AS release

ARG DOCKER_BUILDING
ARG APP_NAME

# copy composer dependencies
COPY --from=composer_dependencies /usr/src/app/vendor ./vendor

# copy node_modules dependencies
COPY --from=npm_dependencies /usr/src/app/prod_node_modules ./node_modules

# copy app sources
COPY . /usr/src/app/

RUN cd /usr/src/app/ && php artisan vendor:publish --all

# run webpack
RUN cd /usr/src/app/ && npm run production
RUN chown -R fbridge.fbridge /usr/src/app

