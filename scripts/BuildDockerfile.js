const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')
const ShellExec = require('./lib/ShellExec.js')

const MODULE_NAME = process.env.BUILD_DATABASE_MODULE

async function unzip(zipPath, targetDir) {
  /*
  return new Promise(resolve => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: targetDir }))
      .on('close', () => {
        resolve()
      })
  })
  */
  await ShellExec(`unzip ${zipPath} -d ${targetDir}`)
}

async function setupData ({BUILD_DIR, USER, config}) {

  // 解壓縮
  // https://www.npmjs.com/package/unzipper
  let targetDir = `./build_tmp/data`
  let containerBackupFolder = config.environment.database[MODULE_NAME].data_path

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir, {recursive: true})

  let zipPath = `${BUILD_DIR}/data/database-${MODULE_NAME}.zip`
  let copyCmd = ''
  if (fs.existsSync(zipPath)) {

    // console.log('before unzip')
    await unzip(zipPath, targetDir)
    // console.log('after unzip')
    
    // console.log('有成功解壓縮嗎？')
    await ShellExec(`ls ${targetDir}`)

    console.log(`Unzip ${zipPath} to`, targetDir)

    copyCmd = `COPY ${targetDir} ${containerBackupFolder}`

  }

  return {copyCmd, containerBackupFolder}
}

// function setupUser (USER) {
//   let setSystemUser = ''
//   if (USER && USER !== 'root') {
//     setSystemUser = `USER ${USER}`
//   }
//   return setSystemUser
// }

// function buildEntrypoint ({config, BUILD_DIR, REPO}) {
//   let {CMD} = config.environment.database[MODULE_NAME].Dockerfile

//   let script = fs.readFileSync('/app/docker-gitlab-build-db/scripts/entrypoint.sh', 'utf8')

//   let scriptCMD = `

// # =================================
// # Original Command:
// ${CMD}

// `

//   script += scriptCMD

//   fs.writeFileSync('./build_tmp/entrypoint.sh', script, 'utf8')

//   console.log('====================')
//   console.log(path.join(BUILD_DIR, '/build_tmp/entrypoint.sh'))
//   console.log('====================')
//   console.log(script)
//   console.log('====================\n\n')
// }

// ----------------------------------------------------------------

module.exports = async function (config) {

  // 這是Gitlab CI Runner的路徑
  const BUILD_DIR = path.join('/builds/', process.env.CI_PROJECT_NAMESPACE, process.env.CI_PROJECT_NAME)
  process.chdir(BUILD_DIR)

  const REPO = process.env.CI_PROJECT_NAME + '-' + process.env.CI_PROJECT_NAMESPACE
  console.log("REPO: " + REPO)

  let {image, data_path, Dockerfile} = config.environment.database[MODULE_NAME]
  let {USER} = Dockerfile

  fs.mkdirSync('./build_tmp/')
  //await ShellExec(`echo build_tmp >> .dockerignore`)

  // ------------------------------------
  // 處理備份檔案問題
  // console.log('before setupData')
  let {copyCmd} = await setupData({BUILD_DIR, USER, config})
  // console.log('after setupData')

  // ----------------------------------------------------
  // let setSystemUser = setupUser(USER)

  // ----------------------------------------------------
  // 建立 entrypoint.sh
  // buildEntrypoint({config, BUILD_DIR, REPO})
 
  // ------------------------

  let dockerfile = `FROM ${image}

${copyCmd}

RUN echo "${new Date()}"
`
  
  console.log('====================')
  console.log(dockerfile)
  console.log('====================\n\n')

  fs.writeFileSync('./build_tmp/Dockerfile', dockerfile, 'utf8')
  console.log('Database Dockerfile created')

  // console.log('====================')
  // console.log(`ls ./build_tmp/`)
  // await ShellExec(`ls ./build_tmp/`)
  // console.log('====================')
  // console.log(`ls ./build_tmp/data`)
  // await ShellExec(`ls ./build_tmp/data`)
  // console.log('====================')
}