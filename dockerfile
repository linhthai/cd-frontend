FROM node:8.9-alpine

MAINTAINER linhthai

WORKDIR /opt
RUN mkdir -p resource
WORKDIR resource

ADD . devices-tools-deployments/

RUN npm install -g gulp
RUN npm install -g bower
WORKDIR devices-tools-deployments
RUN npm install
RUN bower install --allow-root
RUN which gulp
CMD  /usr/local/bin/gulp serve