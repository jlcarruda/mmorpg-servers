"use strict";

const fs = require('fs')

let _readFilename;
let _outputFilename;
let _ok = true
function writeToFile(writer, data) {
  if (!_ok) {
    writer.once('drain', () => {
      _ok = true
      writeToFile(writer, data)
    })
  } else {
    let parsed = data.toString().replace(/\,(?=\s*?[\}\]])/g, '') // Removing trailing commas
    _ok = writer.write(parsed)
  }
}

function getArgs() {
  const myArgs = process.argv.slice(2)
  const _readCommand = myArgs.findIndex((v) => v === '-rf')
  const _outputCommand = myArgs.findIndex((v) => v === '-of')

  if (_readCommand >= 0){
    _readFilename = myArgs[_readCommand + 1]
    if (!_readFilename) throw new Error('Missing read command value')
  } else {
    throw new Error('Missing read command')
  }

  if (_outputCommand >= 0) {
    _outputFilename = myArgs[_outputCommand + 1]
  }

  if (!_outputFilename) {
    const _aux = _readFilename.replace(/\.[0-9a-z]+$/i, '.json').split('/')
    _outputFilename = _aux[_aux.length - 1]
  }

  return { out: _outputFilename, read: _readFilename }
}

module.exports = (() => {
  const { out, read } = getArgs()
  let now = Date.now()
  const outFile = out.replace(/\.[0-9a-z]+$/i, `_v${now}.json`)
  const outPath = `./converted/${outFile}`
  const readMapFile = fs.createReadStream(read)
  const writeMapFile = fs.createWriteStream(outPath)
  writeMapFile.setMaxListeners(20)

  readMapFile.on('data', (chunk) => {
    writeToFile(writeMapFile, chunk)
  })

  readMapFile.on('end', () => {
    console.log(outPath)
  })
})()
