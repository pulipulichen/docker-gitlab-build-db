module.exports =  function (dirname) {
  let files = fs.readdirSync(dirname)
  return (files.length === 0)
}
