const fs = require('fs')
const path = require('path')

const LoadYAMLConfig = require('./scripts/lib/LoadYAMLConfig.js')
const MODULE_NAME = process.env.BUILD_DATABASE_MODULE

// const BUILD_DIR = path.join('/webapp-build/', process.env.CI_PROJECT_NAMESPACE, process.env.CI_PROJECT_NAME)
// if (config.database.init === false || 
//   fs.existsSync(BUILD_DIR + '/database/database-pvc.zip') === false) {
//   console.log('Do not initialized.', )
//   process.exit()
// }

//const UnzipDatabasePVC = require('./lib/UnzipDatabasePVC.js')
const BuildDockerfile = require('./scripts/BuildDockerfile.js')
const PushDockerfile = require('./scripts/PushDockerfile.js')
const BuildDockerfileInit = require('./scripts/BuildDockerfileInit.js')
const PushDockerfileInit = require('./scripts/PushDockerfileInit.js')
const UpdateDeployTag = require('./scripts/UpdateDeployTag.js')

const WaitForLock = require('./scripts/lib/WaitForLock.js')

const main = async function () {
  // if (config.backup.persist_data === true) {
  //   console.log('config.backup.persist_data is true. Update is skipped.')
  //   return true
  // }
  const config = await LoadYAMLConfig()

  if (config.deploy.enable !== true) {
    console.log('Build is disabled.')
    return
  }

  //await UnzipDatabasePVC(config)
  if (fs.existsSync(`./data/database-${MODULE_NAME}.zip`) === false) {
    console.log('Data dost not exists. Remove tag.')
    await UpdateDeployTag(config, '')
    return false
  }

  await WaitForLock.lock('db-build-dockerfile')

  await BuildDockerfile(config)
  await BuildDockerfileInit(config)
  let tag = await PushDockerfile(config)
  await PushDockerfileInit(config)
  await UpdateDeployTag(config, tag)

  await WaitForLock.unlock('db-build-dockerfile')
}

main()
