const parser = require('./parser')

const REQUEST_HANDSHAKE = "REQUEST_HANDSHAKE"
const CHAR_UPDATE = "CHAR_UPDATE"
const POS_UPDATE = "POS_UPDATE"
const POS_UPDATE_RUN = "POS_UPDATE_RUN"
const CHAR_SELECTED = "CHAR_SELECTED"

const messages = {
  REQUEST_HANDSHAKE,
  CHAR_UPDATE,
  POS_UPDATE,
  POS_UPDATE_RUN,
  CHAR_SELECTED
}


module.exports = {
  messages,
  parser
}
