TAG=20220602-1922

REPO=gitlab-build-db

docker build -t pudding/$REPO:$TAG .
docker push pudding/$REPO:$TAG