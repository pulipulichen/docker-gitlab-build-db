TAG=20220522-1231

REPO=gitlab-build-db

docker build -t pudding/$REPO:$TAG .
docker push pudding/$REPO:$TAG