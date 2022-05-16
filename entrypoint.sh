CURRENT_DIR=`pwd`
cd /app/docker-gitlab-build-db/
rm -rf *.sh *.js scripts
git reset --hard
git pull
cd $CURRENT_DIR
ls