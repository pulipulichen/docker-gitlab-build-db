const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')

module.exports = function (config) {
  const BUILD_DIR = path.join('/builds/', process.env.CI_PROJECT_NAMESPACE, process.env.CI_PROJECT_NAME)

  //console.log('ENV', process.env)
  let module = process.env["BUILD_DATABASE_MODULE"]
  //console.log('module', module)

  let dockerImage = config.deploy.database[module].image
  let dataPath = config.deploy.database[module].data_path
  let cmd = config.deploy.database[module].cmd

  let systemUser = ''
  if (config.deploy.database[module].system_user) {
    systemUser = 'USER ' + config.deploy.database[module].system_user
  }

  // 解壓縮
  // https://www.npmjs.com/package/unzipper
  let targetDir = './backup/database'
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir)

  let zipPath = `./backup/database-${module}.zip`
  let copyCmd = ''
  if (fs.existsSync(zipPath)) {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: targetDir }))
    copyCmd = `COPY ${targetDir} /backup/`
  }

  // 建立 build-init.sh
  let script = fs.readFileSync('/app/scripts/build-init.sh', 'utf8')
  script = script + '\n' + cmd + '\n\n'
  fs.writeFileSync('build-init.sh', script, 'utf8')

  console.log('====================')
  console.log(path.join(BUILD_DIR + '/build-init.sh'))
  console.log('====================')
  console.log(script)
  console.log('====================')

  // ------------------------

  dockerfile = `FROM ${dockerImage}

ENV DATA_PATH=${dataPath}

${copyCmd}
COPY build-init.sh /backup/build-init.sh
RUN chmod 777 /backup/build-init.sh

CMD ["sh", "/backup/build-init.sh"]

${systemUser}
`
  
  console.log('==================')
  console.log(dockerfile)
  console.log('==================')

  fs.writeFileSync('Dockerfile', dockerfile, 'utf8')
  console.log('created')
}