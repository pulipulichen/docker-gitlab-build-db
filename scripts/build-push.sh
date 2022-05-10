REPO=$CI_PROJECT_NAME-$CI_PROJECT_NAMESPACE-db
TAG=$CI_COMMIT_SHORT_SHA

mkdir -p ~/.docker
cp ./webapp-build/token/quay-token-dlll.json ~/.docker/config.json

if [ -f ./database/Dockerfile ]; then
  docker build -f ./webapp-build/Dockerfile -t quay.nccu.syntixi.dev/dlll/$REPO:$TAG .
  docker push quay.nccu.syntixi.dev/dlll/$REPO:$TAG
  
  echo $1
  if [ "$1" = "true" ] ; then
    mkdir ci.tmp/
    echo $TAG > ci.tmp/tag-db.txt
  fi
fi
