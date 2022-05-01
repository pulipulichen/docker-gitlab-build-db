const fs = require('fs')
const path = require('path')

const yaml = require('js-yaml');

const valuesPath = path.resolve(process.cwd(), '/deploy/values.yaml')
//const valuesPath = path.resolve('./values.yaml')
console.log(valuesPath)
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
      isDirEmpty(path.resolve(process.cwd(), '/database/'))) {
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
  fs.writeFileSync(path.resolve(process.cwd(), '/database/Dockerfile'), dockerfile, 'utf8')
  console.log('created')
}