FROM docker:19.03.13

ENV DEBIAN_FRONTEND=noninteractive

#Creating an applicadtion directory
#RUN mkdir /app
#Use app directory as development directory
#WORKDIR /app

RUN apt-get update

# ----------------------

RUN apt-get install -y \
    git curl

# https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04
RUN cd /tmp
RUN curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt install nodejs -y

# ---------------------

RUN mkdir /app
COPY package.json /app/

WORKDIR /app
RUN npm i

RUN mkdir -p /app/scripts
WORKDIR /app/scripts
COPY scripts /app/scripts/