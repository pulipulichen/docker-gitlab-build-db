if [ ${ENABLE_PULL_UPDATE} ]; then
  sh /app/docker-gitlab-build-db/update.sh
fi

node /app/docker-gitlab-build-db/build-dockerfile.js