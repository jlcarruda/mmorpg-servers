const { Character } = require('../models')
const config = require('../../config')
const now = require('performance-now')
const packetParser = require('../network/packet')

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
  console.log("Job running")
  const { x: charX, y: charY } = client.character.position
  console.log("CHAR POS", charX, charY)
  const { x, y } = packet
  console.log("PACKET", packet, x, y)
  const notValid = validateMovement(client.character.position, x, y, isRunning)
  console.log("Not valid? ", notValid)
  if (notValid) {
    client.socket.write(packetParser.build(['POS_DESYNC', charX, charY, now().toString()]))
  } else {
    try  {
      console.log("running pos update")
      await Character.findByIdAndUpdate(client.character._id,  {
        position: {
          x,
          y,
          current_room: client.character.position.current_room
        }
      })

      client.character.position.x = x
      client.character.position.y = y
      // await client.character.save()
      client.socket.write(packetParser.build(['POS_OK', x, y, now().toString()]))
    } catch(err) {
      console.log("ERROR WHILE SAVING POSITION", err)
      client.socket.write(packetParser.build(['POS_DESYNC', charX, charY, now().toString()]))
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
