#
# ---- Base Node ----
FROM registry.stensuldev.net/dockerfiles/web-2.0.0:2.2.0 AS base

# set working directory
WORKDIR /usr/src/app/

# enable opcache heavily
COPY ./conf.d/php/10-opcache.ini /etc/php.d/

ARG DOCKER_BUILDING
ARG APP_NAME
ARG NODE_ENV=production

#
# ---- Dependencies ----
FROM base AS composer_dependencies

COPY ./composer.json /usr/src/app/composer.json
#COPY ./composer.lock /usr/src/app/composer.lock
COPY ./database /usr/src/app/database
COPY ./tests /usr/src/app/tests
COPY ./artisan /usr/src/app/artisan

RUN cd /usr/src/app/ && composer install --no-scripts

FROM base AS npm_dependencies
# install node packages

COPY ./package.json /usr/src/app/package.json
COPY ./package-lock.json /usr/src/app/package-lock.json
RUN cd /usr/src/app/ && npm install

#RUN npm set progress=false && npm config set depth 0
#RUN npm install --only=production 
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules

FROM base AS bower_dependencies
# force cache for bower
#COPY ./.bowerrc /usr/src/app/.bowerrc
#COPY ./bower.json /usr/src/app/bower.json
RUN mkdir -p resources/assets/bower
RUN cd /usr/src/app/ && bower install --allow-root && bower cache clean --allow-root


#
# ---- Test ----
# run linters, setup and tests
#FROM dependencies AS test
#COPY . .
#RUN  npm run lint && npm run setup && npm run test

#
# ---- Release ----
FROM base AS release
# copy production composer
COPY --from=composer_dependencies /usr/src/app/vendor ./vendor

# copy production node_modules
COPY --from=npm_dependencies /usr/src/app/prod_node_modules ./node_modules

# copy production bower 
COPY --from=bower_dependencies /usr/src/app/resources/assets/bower ./resources/assets/bower

# copy app sources
COPY . /usr/src/app/

#RUN cd /usr/src/app/ && php artisan vendor:publish

RUN cd /usr/src/app/ && gulp --production
RUN chown -R fbridge.fbridge /usr/src/app

