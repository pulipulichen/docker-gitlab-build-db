
//const { exec } = require("child_process");

//const isDirEmpty = require("./lib/isDirEmpty")

const ShellExec = require('./lib/ShellExec.js')
const fs = require('fs')
const path = require('path')
const getTagPrefix = require('./lib/getTagPrefix')

const MODULE_NAME = process.env.BUILD_DATABASE_MODULE

module.exports = async function (config) {
  if (fs.existsSync('./build_tmp/Dockerfile') === false) {
    console.error('./build_tmp/Dockerfile is not found. Skip build and push.')
    return false
  }

  let REPO = process.env.CI_PROJECT_NAME + '-' + process.env.CI_PROJECT_NAMESPACE
  console.log(`QUAY REPO: ${REPO}`)

  let TAG = process.env.CI_COMMIT_SHORT_SHA
  let prefix = await getTagPrefix()
  if (prefix && prefix !== '') {
    TAG = prefix + '-' + TAG
  }

  // ----------------------------------------------------------------
  // setup QUAY token

  //fs.mkdirSync('~/.docker')
  await ShellExec(`mkdir -p ~/.docker`) 
  //await ShellExec(`cp ./deploy/token/quay-token.json ~/.docker/config.json`)
  let token = {
    "auths": {}
  }
  token.auths[config.environment.build.quay_auth_host] = {
    "auth": config.environment.build.quay_auth_token,
    "email": ""
  }
  // fs.writeFileSync('/tmp/config.json', JSON.stringify(token), 'utf8')
  console.log(`token`, JSON.stringify(token))
  // await ShellExec(`cat /tmp/config.json`)
  // await ShellExec(`mv /tmp/config.json ~/.docker/`)

  fs.writeFileSync(process.env['HOME'] + '/.docker/config.json', JSON.stringify(token), 'utf8')
  //await ShellExec(`mv /tmp/config.json ~/.docker/`)


  // ------------------------
  
  let QUAY_PREFIX = config.environment.build.quay_prefix
  await ShellExec(`docker build -f ./build_tmp/Dockerfile -t ${QUAY_PREFIX}/${REPO}:${MODULE_NAME}-${TAG} .`)
  await ShellExec(`docker push ${QUAY_PREFIX}/${REPO}:${MODULE_NAME}-${TAG}`, {retry: 3})

  // fs.mkdirSync('./ci.tmp/')
  // fs.writeFileSync('./ci.tmp/TAG_APP.txt', TAG, 'utf8')

  console.log('============================================================')
  console.log(`APP TAG UPDATED: ${MODULE_NAME}-${TAG}`)
  console.log('============================================================')
  
  return TAG
}