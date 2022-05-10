REPO=$CI_PROJECT_NAME-$CI_PROJECT_NAMESPACE-database-$BUILD_DATABASE_MODULE
TAG=$CI_COMMIT_SHORT_SHA

mkdir -p ~/.docker
cp ./webapp-build/token/quay-token.json ~/.docker/config.json

if [ -f /tmp/Dockerfile ]; then
  docker build -f /tmp/Dockerfile -t $QUAY_PREFIX/$REPO:$TAG .
  docker push $QUAY_PREFIX/$REPO:$TAG
  
  echo $1
  if [ "$1" = "true" ] ; then
    mkdir ci.tmp/
    echo $TAG > ci.tmp/tag-database-$BUILD_DATABASE_MODULE.txt
  fi
fi
