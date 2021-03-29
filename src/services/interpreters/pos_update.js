const now = require('performance-now')
const Parser = require('../../network/packet_parser')
const { destroySocket } = require('../utils/socket')
const config = require('../../../config')

module.exports = async (client, { build }, datapacket) => {
  const data = Parser.pos_update.parse(datapacket)

  const { x, y } = data
  
  if (!client.character) {
    return destroySocket(client)
  }
  
  const { x: charX, y: charY } = client.character.position

  // Verify if user does not manipulated position on client side
  const notValid = validateMovement(client.character.position, x, y)
  if (notValid) {
    client.socket.write(build(['POS_DESYNC', charX, charY, now().toString()]))
  } else {
    client.character.position.x = x
    client.character.position.y = y
    
    client.character.save()
    
    client.socket.write(build(['POS_OK', x, y, now().toString()]))
  }

}

function validateMovement({ x, y }, targetX, targetY) {
  const { game: { movement_max_desync, tile_size } } = config
  
  const positionThreshold = movement_max_desync * tile_size

  return (targetX <= x - positionThreshold ||
     targetX >= x + positionThreshold ||
     targetY <= y - positionThreshold || 
     targetY >= y + positionThreshold)
}
