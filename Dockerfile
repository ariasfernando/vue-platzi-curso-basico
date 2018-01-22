FROM registry.stensuldev.net/dockerfiles/web-2.0.0
COPY . /usr/src/app
ARG DOCKER_BUILDING
ARG APP_NAME
RUN cd /usr/src/app/ && composer install
RUN cd /usr/src/app/ && npm install && npm cache clean
RUN cd /usr/src/app/ && npm run production


RUN chown -R fbridge.fbridge /usr/src/app
