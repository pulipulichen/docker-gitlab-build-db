TAG=20220610-1504

REPO=gitlab-build-db

docker build -t pudding/$REPO:$TAG .
docker push pudding/$REPO:$TAG
docker image remove pudding/$REPO:$TAG -f