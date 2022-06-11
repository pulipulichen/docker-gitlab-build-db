
const ShellExec = require('./lib/ShellExec.js')
const sleep = require('./lib/sleep.js')
const fs = require('fs')
const MODULE_NAME = process.env.BUILD_DATABASE_MODULE
const getTagPrefix = require('./lib/getTagPrefix.js')

function getRepoName (config) {
  const DEPLOY_GIT_URL = config.environment.build.deploy_git_url
  let REPO_NAME = DEPLOY_GIT_URL.slice(DEPLOY_GIT_URL.lastIndexOf('/') + 1)
  REPO_NAME = REPO_NAME.slice(0, REPO_NAME.lastIndexOf('.'))

  return REPO_NAME
}

async function setUserNameEmail(config) {
  const DEPLOY_GIT_URL = config.environment.build.deploy_git_url
  let {username, host} = new URL(DEPLOY_GIT_URL)

  await ShellExec(`git config --global user.email "${username}@${host}"`)
  await ShellExec(`git config --global user.name "${username}"`)
}

async function getTag(config) {
  let tag = process.env.CI_COMMIT_SHORT_SHA
  let prefix = getTagPrefix(config)
  if (prefix) {
    tag = prefix + '-' + tag
  }
}

async function main (config, tag, retry = 0) {

  let tmpGitPath = '/tmp/git-deploy'
  fs.mkdirSync(tmpGitPath, { recursive: true})
  process.chdir(tmpGitPath)

  const REPO = process.env.CI_PROJECT_NAME + '-' + process.env.CI_PROJECT_NAMESPACE
  console.log("REPO: " + REPO)

  const DEPLOY_GIT_URL = config.environment.build.deploy_git_url
  await ShellExec(`git clone -b ${REPO} ${DEPLOY_GIT_URL} || git clone ${DEPLOY_GIT_URL}`, {retry: 3})

  const REPO_NAME = getRepoName(config)
  process.chdir(tmpGitPath + '/' + REPO_NAME)

  await setUserNameEmail(config)
  await ShellExec(`git checkout -b ${REPO} || git checkout ${REPO}`, {retry: 3})

  // ----------------------------------------------------------------

  let remove = false
  if (tag === '') {
    remove = true

    tag = process.env.CI_COMMIT_SHORT_SHA
    let prefix = await getTagPrefix()
    if (prefix && prefix !== '') {
      tag = prefix + '-' + tag
    }
  }

  if (remove === false) {
    fs.writeFileSync(`TAG_DATABASE_${MODULE_NAME.toUpperCase()}.txt`, tag, 'utf8')
    console.log(`Write ${tag} to TAG_DATABASE_${MODULE_NAME.toUpperCase()}.txt`)
  }
  else {
    fs.writeFileSync(`TAG_DATABASE_${MODULE_NAME.toUpperCase()}.txt`, '', 'utf8')
  }
  
  // ----------------------------------------------------------------

  await ShellExec(`git add .`)
  await ShellExec(`git commit -m "CI TAG: ${tag}" --allow-empty`)
  try {
    await ShellExec(`git push -f ${DEPLOY_GIT_URL}`)
  }
  catch (e) {
    console.error(e) 
    await sleep(5000)
    fs.rm(tmpGitPath, {recursive: true})
    retry++
    return await main(config, tag, retry)
  }
}

module.exports = main