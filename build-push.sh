TAG=20220510-1337

REPO=gitlab-build-db

docker build -t pudding/$REPO:$TAG .
docker push pudding/$REPO:$TAG