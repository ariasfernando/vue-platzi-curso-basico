##
# This is a optimized Dockerfile for docker version minor to 1.12
# You will see lots of COPY and this is being done in order to
# get most of docker cache.
# Please do not touch this file unless you are sure
# what you are doing
##


FROM registry.stensuldev.net/dockerfiles/web-2.0.0:2.2.0

# enable opcache heavily
COPY ./conf.d/php/10-opcache.ini /etc/php.d/

ARG DOCKER_BUILDING
ARG APP_NAME
ARG NODE_ENV=production

# force cache for composer 
COPY ./composer.json /usr/src/app/composer.json
COPY ./composer.lock /usr/src/app/composer.lock
COPY ./database /usr/src/app/database
COPY ./tests /usr/src/app/tests
COPY ./artisan /usr/src/app/artisan
RUN cd /usr/src/app/ && composer install --no-scripts

# force cache for npm 
COPY ./package.json /usr/src/app/package.json
COPY ./package-lock.json /usr/src/app/package-lock.json
RUN cd /usr/src/app/ && npm install

WORKDIR /usr/src/app/

COPY . /usr/src/app/

RUN cd /usr/src/app/ && php artisan vendor:publish --all

RUN cd /usr/src/app/ && npm run production
RUN chown -R fbridge.fbridge /usr/src/app
