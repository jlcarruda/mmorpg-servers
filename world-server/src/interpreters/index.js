const HANDSHAKE = require('./handshake')
const CHAR_SELECTED = require('./char_selected')
const POS_UPDATE = require('./pos_update')
const CHAR_UPDATE = require('./char_update')

module.exports = {
  h: HANDSHAKE,
  cs: CHAR_SELECTED,
  pu: POS_UPDATE,
  pur: (client, socket, datapacket) => POS_UPDATE(client, socket, datapacket, true),
  cu: CHAR_UPDATE,
}
