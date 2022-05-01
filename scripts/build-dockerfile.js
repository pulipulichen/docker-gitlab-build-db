const fs = require('fs')
const path = require('path')

const yaml = require('js-yaml')

const BUILD_DIR = path.resolve('/builds/', process.env.CI_PROJECT_NAMESPACE, process.env.CI_PROJECT_NAME)
console.log("BUILD_DIR", BUILD_DIR)
const valuesPath = BUILD_DIR + '/deploy/values.yaml'
//const valuesPath = path.resolve('./values.yaml')
console.log("valuesPath", valuesPath)
if (fs.existsSync(valuesPath) === false) {
  console.error('values.yaml is not found: ', valuesPath)
  process.exit()
}
const valuesStr = fs.readFileSync(valuesPath, 'utf8')
console.log(valuesStr)
const config = yaml.load(valuesStr)
console.log(config)

function isDirEmpty(dirname) {
  return fs.promises.readdir(dirname).then(files => {
      return files.length === 0;
  });
}

if (config.database.init === false || 
      isDirEmpty(BUILD_DIR + '/database/')) {
  console.log('Do not initialized.')
  process.exit()
}

let dockerfile

if (config.database.driver === 'mysql') {
  dockerfile = `FROM mysql:5.7.15
COPY ./database /docker-entrypoint-initdb.d`
}
else if (config.database.driver === 'pgsql') {
  dockerfile = `FROM postgres:11.14
COPY ./database /docker-entrypoint-initdb.d`
}

console.log(dockerfile)

if (dockerfile) {
  fs.writeFileSync(BUILD_DIR + '/database/Dockerfile', dockerfile, 'utf8')
  console.log('created')
}


const { exec } = require("child_process");

exec("/app/scripts/build-push.sh", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});