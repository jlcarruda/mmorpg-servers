const { Character } = require('../models')
const config = require('../../config')
const now = require('performance-now')
const packetParser = require('../network/packet')
const ClientPool = require('../network/client-pool')

module.exports = async (job) => {
  console.log("Job Switch", job.data.command)
  switch(job.data.command) {
    case "POS_UPDATE_RUN":
      return await pos_update(job.data, true)
    case "POS_UPDATE":
      return await pos_update(job.data, false)
  }
}

async function pos_update({ client, command, packet }, isRunning) {
  const pool = ClientPool.getInstance()
  const clientObj = pool.findById(client.id)
  const { x: charX, y: charY } = clientObj.character.position
  const { x, y } = packet
  const notValid = validateMovement(clientObj.character.position, x, y, isRunning)
  if (notValid) {
    clientObj.socket.write(packetParser.build(['POS_DESYNC', charX, charY, now().toString()]))
  } else {
    try  {

      clientObj.character.position.x = x
      clientObj.character.position.y = y
      await clientObj.character.save()
      clientObj.socket.write(packetParser.build(['POS_OK', x, y, now().toString()]))
    } catch(err) {
      console.log("ERROR WHILE SAVING POSITION", err)
      clientObj.socket.write(packetParser.build(['POS_DESYNC', charX, charY, now().toString()]))
    }
  }
}


function validateMovement({ x, y }, targetX, targetY, isRunning) {
  const { game: { movement_max_desync, tile_size } } = config

  const positionThreshold = (isRunning ? movement_max_desync * 2 : movement_max_desync) * tile_size

  return (targetX <= x - positionThreshold ||
     targetX >= x + positionThreshold ||
     targetY <= y - positionThreshold ||
     targetY >= y + positionThreshold)
}
