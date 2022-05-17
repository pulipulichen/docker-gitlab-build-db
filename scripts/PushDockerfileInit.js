
//const { exec } = require("child_process");

//const isDirEmpty = require("./lib/isDirEmpty")

const ShellExec = require('./lib/ShellExec.js')
const fs = require('fs')
const path = require('path')

const MODULE_NAME = process.env.BUILD_DATABASE_MODULE

function getTagPrefix(config) {
  let prefix = config.deploy.docker_image_tag_prefix

  if (!prefix) {
    return
  }

  prefix = prefix.toLowerCase()
  prefix = prefix.replace(/[^a-zA-Z0-9\-]/g, "")

  return prefix
}

module.exports = async function (config) {
  if (fs.existsSync('./build_tmp/DockerfileInit') === false) {
    console.error('./build_tmp/DockerfileInit is not found. Skip build and push.')
    return false
  }

  let REPO = process.env.CI_PROJECT_NAME + '-' + process.env.CI_PROJECT_NAMESPACE + 
             '-' + MODULE_NAME + '-init'
  console.log(`QUAY REPO: ${REPO}`)

  let TAG = process.env.CI_COMMIT_SHORT_SHA
  let prefix = getTagPrefix(config)
  if (prefix && prefix !== '') {
    TAG = prefix + '-' + TAG
  }

  // ----------------------------------------------------------------
  // setup QUAY token

  //fs.mkdirSync('~/.docker')

  // await ShellExec(`mkdir -p ~/.docker`) 
  // await ShellExec(`cp ./deploy/token/quay-token.json ~/.docker/config.json`)
  
  // ------------------------
  
  let QUAY_PREFIX = config.environment.build.quay_prefix
  await ShellExec(`docker build -f ./build_tmp/DockerfileInit -t ${QUAY_PREFIX}/${REPO}:${TAG} .`)
  await ShellExec(`docker push ${QUAY_PREFIX}/${REPO}:${TAG}`)

  // fs.mkdirSync('./ci.tmp/')
  // fs.writeFileSync('./ci.tmp/TAG_APP.txt', TAG, 'utf8')

  console.log('============================================================')
  console.log(`APP TAG UPDATED: ${TAG}`)
  console.log('============================================================')
  
  return TAG
}