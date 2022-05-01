TAG=20220501-2052

docker build -t pudding/gitlab-build-db:$TAG .
docker push pudding/gitlab-build-db:$TAG