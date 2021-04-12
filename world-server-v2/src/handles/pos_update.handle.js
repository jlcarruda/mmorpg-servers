const now = require('performance-now')

const config = require('../../config')
const { Pool: ClientPool } = require('../libs/client')
const { Pool: SocketPool, packet, protocol: { messages } } = require('../libs/network')
// const { Character } = require('../models')

module.exports = async (job) => {
  switch(job.data.command) {
    case "POS_UPDATE_RUN":
      return await pos_update(job.data, true)
    case "POS_UPDATE":
      return await pos_update(job.data, false)
  }
}

async function pos_update({ client, packet: packetReceived }, isRunning) {
  const socketPool = SocketPool.getInstance()
  const clientPool = await ClientPool.getInstance()
  const socket = socketPool.get(client.socket)
  const { x: charX, y: charY } = client.character.position
  const { x, y } = packetReceived
  const notValid = validateMovement(client.character.position, x, y, isRunning)
  if (notValid) {
    socket.write(packet.build([messages.POS_DESYNC, charX, charY, now().toString()]))
  } else {
    try  {

      client.character.position.x = x
      client.character.position.y = y
      await clientPool.update(client)
      socket.write(packet.build([messages.POS_OK, x, y, now().toString()]))
    } catch(err) {
      console.log("ERROR WHILE SAVING POSITION", err)
      socket.write(packet.build([messages.POS_DESYNC, charX, charY, now().toString()]))
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
