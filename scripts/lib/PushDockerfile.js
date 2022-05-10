
const { exec } = require("child_process");

module.exports = function (config) {
  //console.log(config)
  let UPDATE_TAG = "false"
  if (config.backup.persist_data === false) {
    UPDATE_TAG = "true"
  }

  return new Promise(function (resolve, reject) {
    exec("/app/scripts/build-push.sh " + UPDATE_TAG , (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        reject(error)
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        //resolve(`stderr: ${stdout}`)
        if (stderr.indexOf(' not found ') > -1) {
          reject(stderr)
          throw Error(stderr)
          return
        }

        //reject(error)
      }
      console.log(`stdout: ${stdout}`);
      resolve(`stdout: ${stdout}`)
    });
  })
}