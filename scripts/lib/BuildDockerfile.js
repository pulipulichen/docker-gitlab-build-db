const fs = require('fs')
const path = require('path')

module.exports = function (config) {
  const BUILD_DIR = path.join('/builds/', process.env.CI_PROJECT_NAMESPACE, process.env.CI_PROJECT_NAME)

  //console.log('ENV', process.env)
  let module = process.env["BUILD_DATABASE_MODULE"]
  //console.log('module', module)

  let dockerImage = config.deploy.database[module]
  let dataPath = config.database[module].data_path
  let cmd = config.database[module].cmd

  // 建立 build-init.sh
  let script = fs.readFileSync('/app/scripts/build-init.sh', 'utf8')
  script = script + '\n' + cmd
  fs.writeFileSync('build-init.sh', script, 'utf8')

  console.log('====================')
  console.log(path.join(BUILD_DIR + '/build-init.sh'))
  console.log('====================')
  console.log(script)
  console.log('====================')

  // ------------------------

  dockerfile = `FROM ${dockerImage}
COPY ./backup/database-${module}.zip /backup/database.zip
ENV DATA_PATH=${dataPath}

RUN apt update; apt-get install -y unzip
COPY build-init.sh /backup/build-init.sh
RUN chmod 777 /backup/build-init.sh
CMD ["sh", "/backup/build-init.sh"]
`
  
  console.log('==================')
  console.log(dockerfile)
  console.log('==================')

  fs.writeFileSync('Dockerfile', dockerfile, 'utf8')
  console.log('created')
}