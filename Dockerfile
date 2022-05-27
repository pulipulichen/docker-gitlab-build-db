FROM node:16.15.0-buster

RUN apt-get update
RUN apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update
RUN apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# ---------------------

RUN mkdir /app
WORKDIR /app

RUN git clone https://github.com/pulipulichen/docker-gitlab-build-db.git

WORKDIR /app/docker-gitlab-build-db

COPY package.json /app/docker-gitlab-build-db/


RUN npm i
#RUN npm i -g js-yaml

#RUN mkdir -p /app/scripts
#WORKDIR /app/scripts
COPY scripts /app/docker-gitlab-build-db/scripts/
COPY build-dockerfile.js /app/docker-gitlab-build-db/

WORKDIR /app/docker-gitlab-build-db/

COPY build-dockerfile.* /app/docker-gitlab-build-db/