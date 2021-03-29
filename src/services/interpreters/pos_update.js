const now = require('performance-now')
const Parser = require('../../network/packet_parser')
const { destroySocket } = require('../utils/socket')
const config = require('../../../config')

module.exports.POS_UPDATE = async (client, { build }, datapacket, isRunning = false) => {
  let data;
  if (!isRunning) {
    data = Parser.pos_update.parse(datapacket)
  } else {
    data = Parser.pos_update_run.parse(datapacket)
  }

  const { x, y } = data
  
  if (!client.character) {
    return destroySocket(client)
  }
  
  const { x: charX, y: charY } = client.character.position

  // Verify if user did not manipulated position on client side
  const notValid = validateMovement(client.character.position, x, y, isRunning)
  if (notValid) {
    client.socket.write(build(['POS_DESYNC', charX, charY, now().toString()]))
  } else {
    client.character.position.x = x
    client.character.position.y = y
    
    client.character.save()
    
    client.socket.write(build(['POS_OK', x, y, now().toString()]))
  }

}

module.exports.POS_UPDATE_RUN = (client, packet, datapacket) => {
  this.POS_UPDATE(client, packet, datapacket, true)
}

function validateMovement({ x, y }, targetX, targetY, isRunning) {
  const { game: { movement_max_desync, tile_size } } = config
  
  const positionThreshold = (isRunning ? movement_max_desync * 2 : movement_max_desync) * tile_size

  return (targetX <= x - positionThreshold ||
     targetX >= x + positionThreshold ||
     targetY <= y - positionThreshold || 
     targetY >= y + positionThreshold)
}
