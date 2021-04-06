const HANDSHAKE = require('./handshake')
const CHAR_SELECTED = require('./char_selected')
const POS_UPDATE = require('./pos_update')
const CHAR_UPDATE = require('./char_update')

module.exports = {
  HANDSHAKE,
  CHAR_SELECTED,
  POS_UPDATE,
  POS_UPDATE_RUN: (client, datapacket) => POS_UPDATE(client, datapacket, true),
  CHAR_UPDATE,
}
