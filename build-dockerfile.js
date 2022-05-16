const fs = require('fs')
const path = require('path')

const LoadYAMLConfig = require('./scripts/lib/LoadYAMLConfig.js')


// const BUILD_DIR = path.join('/webapp-build/', process.env.CI_PROJECT_NAMESPACE, process.env.CI_PROJECT_NAME)
// if (config.database.init === false || 
//   fs.existsSync(BUILD_DIR + '/database/database-pvc.zip') === false) {
//   console.log('Do not initialized.', )
//   process.exit()
// }

//const UnzipDatabasePVC = require('./lib/UnzipDatabasePVC.js')
const BuildDockerfile = require('./scripts/BuildDockerfile.js')
const PushDockerfile = require('./scripts/lib/PushDockerfile.js')

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
  await BuildDockerfile(config)
  let tag = await PushDockerfile(config)
  await UpdateDeployTag(config, tag)
}

main()
