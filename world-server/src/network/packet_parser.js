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
    .string('id', stringOptions),
  char_selected: new Parser().skip(1)
    .string('command', stringOptions)
    .string('token', stringOptions)
    .string('char_id', stringOptions),
  pos_update: new Parser().skip(1)
    .string('command', stringOptions)
    .int32le('x', stringOptions)
    .int32le('y', stringOptions),
  pos_update_run: new Parser().skip(1)
    .string('command', stringOptions)
    .int32le('x', stringOptions)
    .int32le('y', stringOptions),
  char_update: new Parser().skip(1)
    .string('command', stringOptions)
    .string('state', stringOptions)
}
