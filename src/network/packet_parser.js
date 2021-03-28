const { Parser } = require('binary-parser')

const stringOptions = {
  length: 999,
  zeroTerminated: true
}

module.exports = {
  header: new Parser().skip(1)
    .string('command', stringOptions),
  handshake: new Parser().skip(1)
    .string('command', stringOptions)
    .string('token', stringOptions)
}
