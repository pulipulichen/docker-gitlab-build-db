const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')
const ShellExec = require('./lib/ShellExec.js')

const MODULE_NAME = process.env.BUILD_DATABASE_MODULE

function setupData ({BUILD_DIR, USER}) {

  // 解壓縮
  // https://www.npmjs.com/package/unzipper
  let targetDir = `./build_tmp/data`
  let containerBackupFolder = `/paas_data/database/`

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir, {recursive: true})

  let zipPath = `${BUILD_DIR}/data/database-${MODULE_NAME}.zip`
  let copyCmd = ''
  if (fs.existsSync(zipPath)) {

    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: targetDir }))
    
    console.log('Unzip app.zip to', targetDir)

    copyCmd = `COPY ${targetDir} ${containerBackupFolder}
RUN chmod -R 777 ${containerBackupFolder}/*`

    if (USER) {
      copyCmd += `\nRUN chown ${USER}:${USER} -R ${containerBackupFolder}`
    }
  }

  return {copyCmd, containerBackupFolder}
}

function setupUser (USER) {
  let setSystemUser = ''
  if (USER && USER !== 'root') {
    setSystemUser = `USER ${USER}`
  }
  return setSystemUser
}

function buildEntrypoint ({config, BUILD_DIR, REPO}) {
  let {CMD} = config.environment.database[MODULE_NAME].Dockerfile

  let script = fs.readFileSync('/app/docker-gitlab-build-db/scripts/entrypoint.sh', 'utf8')

  let scriptCMD = `

# =================================
# Original Command:
${CMD}

`

  script += scriptCMD

  fs.writeFileSync('./build_tmp/entrypoint.sh', script, 'utf8')

  console.log('====================')
  console.log(path.join(BUILD_DIR, '/build_tmp/entrypoint.sh'))
  console.log('====================')
  console.log(script)
  console.log('====================\n\n')
}

// ----------------------------------------------------------------

module.exports = async function (config) {

  // 這是Gitlab CI Runner的路徑
  const BUILD_DIR = path.join('/builds/', process.env.CI_PROJECT_NAMESPACE, process.env.CI_PROJECT_NAME)

  const REPO = process.env.CI_PROJECT_NAME + '-' + process.env.CI_PROJECT_NAMESPACE
  console.log("REPO: " + REPO)

  let {image, data_path, Dockerfile} = config.environment.database[MODULE_NAME]
  let {USER, CMD} = Dockerfile

  fs.mkdirSync('./build_tmp/')
  await ShellExec(`echo build_tmp >> .dockerignore`)

  // ------------------------------------
  // 處理備份檔案問題
  let {copyCmd} = setupData({BUILD_DIR, USER})

  // ----------------------------------------------------
  let setSystemUser = setupUser(USER)

  // ----------------------------------------------------
  // 建立 entrypoint.sh
  buildEntrypoint({config, BUILD_DIR, REPO})
 
  // ------------------------

  let dockerfile = `FROM ${image}

ENV DATA_PATH=${data_path}

${copyCmd}
COPY ./build_temp/entrypoint.sh /paas_data/build-init.sh
RUN chmod 777 /paas_data/build-init.sh

CMD ["sh", "/paas_data/build-init.sh"]

# USER 一定要最後設定
${setSystemUser}

# 確保每次都能更新
RUN echo "${new Date()}
`
  
  console.log('====================')
  console.log(dockerfile)
  console.log('====================\n\n')

  fs.writeFileSync('./build_tmp/Dockerfile', dockerfile, 'utf8')
  console.log('created')
}