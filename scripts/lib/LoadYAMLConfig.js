const fs = require('fs')
const path = require('path')

const yaml = require('js-yaml')

module.exports = function () {

  const BUILD_DIR = path.join('/builds/', process.env.CI_PROJECT_NAMESPACE, process.env.CI_PROJECT_NAME)
  process.chdir(BUILD_DIR);
  //console.log("BUILD_DIR", BUILD_DIR)
  const valuesPath = BUILD_DIR + '/deploy/values.yaml'
  //const valuesPath = path.resolve('./values.yaml')
  //console.log("valuesPath", valuesPath)
  if (fs.existsSync(valuesPath) === false) {
    console.error('values.yaml is not found: ', valuesPath)
    process.exit()
  }
  const valuesStr = fs.readFileSync(valuesPath, 'utf8')
  //console.log(valuesStr)
  const config = yaml.load(valuesStr)
  console.log(config)
  return config
}