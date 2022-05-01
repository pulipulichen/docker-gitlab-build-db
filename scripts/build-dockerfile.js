const fs = require('fs')
const path = require('path')

const yaml2json = require('yaml-to-json')


const valuesStr = fs.readFileSync(path.resolve(process.env.BUILD_DIR, '/deploy/values.yaml'), 'utf8')

const config = yaml2json(valuesStr)
console.log(config)

function isDirEmpty(dirname) {
  return fs.promises.readdir(dirname).then(files => {
      return files.length === 0;
  });
}

if (config.database.init === false || 
      isDirEmpty(path.resolve(process.env.BUILD_DIR, '/database/'))) {
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
  fs.writeFileSync(path.resolve(process.env.BUILD_DIR, '/database/Dockerfile'), dockerfile, 'utf8')
  console.log('created')
}