TAG=20240718-1704

REPO=gitlab-build-db

docker-compose build

docker tag docker-gitlab-build-db-app pudding/$REPO:$TAG

docker push pudding/$REPO:$TAG
docker rmi pudding/$REPO:$TAG