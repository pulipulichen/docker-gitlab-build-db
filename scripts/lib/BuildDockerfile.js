const fs = require('fs')
const path = require('path')

module.exports = function (config) {
  const BUILD_DIR = path.join('/builds/', process.env.CI_PROJECT_NAMESPACE, process.env.CI_PROJECT_NAME)

  let module = process.env["MODULE"]

  let dockerImage = config.deploy.database[module]
  let dataPath = config.database[module].data_path
  let cmd = config.database[module].cmd

  // 建立 build-init.sh
  let script = fs.readFileSync('/app/scripts/build-dockerfile.js', 'utf8')
  script = script + '\n' + cmd
  fs.writeFileSync('/tmp/build-init.sh', script, 'utf8')

  // ------------------------

  dockerfile = `FROM ${dockerImage}
COPY  ./backup/database-${module}.zip /backup/database.zip
ENV DATA_PATH=${dataPath}

RUN apt update; apt-get install -y unzip
COPY /tmp/build-init.sh /backup/build-init.sh
RUN chmod 777 /backup/build-init.sh
CMD ["/backup/build-init.sh"]
`
  
  console.log('==================')
  console.log(dockerfile)
  console.log('==================')

  if (dockerfile) {
    fs.writeFileSync(BUILD_DIR + '/backup/Dockerfile', dockerfile, 'utf8')
    console.log('created')
  }
}