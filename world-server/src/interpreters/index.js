const HANDSHAKE = require('./handshake')
const CHAR_SELECTED = require('./char_selected')
const { POS_UPDATE } = require('./pos_update')

module.exports = {
  HANDSHAKE,
  CHAR_SELECTED,
  POS_UPDATE,
  POS_UPDATE_RUN: (client, heart, packet, datapacket) => POS_UPDATE(client, heart, packet, datapacket, true)
}
