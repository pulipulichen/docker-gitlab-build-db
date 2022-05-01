REPO=$CI_PROJECT_NAME-$CI_PROJECT_NAMESPACE-db
TAG=$CI_COMMIT_SHORT_SHA

mkdir -p ~/.docker
cp ./build/token/quay-token-dlll.json ~/.docker/config.json

if [ -f ./database/Dockerfile ]; then
  docker build -f ./database/Dockerfile -t quay.nccu.syntixi.dev/dlll/$REPO:$TAG .
  docker push quay.nccu.syntixi.dev/dlll/$REPO:$TAG
  mkdir ci.tmp/
  echo $TAG > ci.tmp/db-tag.txt
fi