TAG=20220605-1427

REPO=gitlab-build-db

docker build -t pudding/$REPO:$TAG .
docker push pudding/$REPO:$TAG