TAG=20220611-2338

REPO=gitlab-build-db

docker build -t pudding/$REPO:$TAG .
docker push pudding/$REPO:$TAG
docker image remove pudding/$REPO:$TAG -f