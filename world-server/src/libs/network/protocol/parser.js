const { Parser } = require('binary-parser')

const stringOptions = {
  length: 999,
  zeroTerminated: true
}

function generateParser() {
  return new Parser().skip(1).string('command', stringOptions).string('client_id', stringOptions)
}

module.exports = {
  header: generateParser(),
  handshake: generateParser()
    .string('token', stringOptions)
    .string('user_id', stringOptions),
  char_selected: generateParser()
    .string('token', stringOptions)
    .string('char_id', stringOptions),
  pos_update: generateParser()
    .int32le('x', stringOptions)
    .int32le('y', stringOptions),
  pos_update_run: generateParser()
    .int32le('x', stringOptions)
    .int32le('y', stringOptions),
  char_update: generateParser()
    .string('state', stringOptions)
}
