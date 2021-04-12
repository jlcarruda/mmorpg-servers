const { parser } = require('./protocol')
const { Pool: ClientPool } = require('../client')

const zeroBuffer = Buffer.from('00', 'hex')

const interpret = async (datapacket) => {
  try {
    const clientPool = await ClientPool.create()
    let { command, client_id } = parser.header.parse(datapacket)
    const client = await clientPool.findById(short().toUUID(client_id))
    // const socket = socketPool.get(client.socket)
    // if (!client) {
    //   console.error('[PACKET] Client could not be located. Disconnection packet sent')
    // }

    console.log(`[PACKET] Interpret: ${command}`)
    // If command is implemented
    // if (interpreters[command]) {
    //   interpreters[command](client, socket, datapacket)
    // }
  } catch (err) {
    console.error(`[GAMEWORLD] Error while interpreting packet`, err)
    throw err
  }
}

module.exports = {
  build: (params) => {
    let packetParts = []
    let packetSize = 0

    params.forEach( param => {
      let buffer;

      switch (typeof param) {
        case 'string':
          buffer = Buffer.from(param, 'utf-8')
          buffer = Buffer.concat([buffer, zeroBuffer], buffer.length + 1)
          break;
        case 'number':
          buffer = Buffer.alloc(4)
          buffer.writeInt32LE(param, 0)
          break;
        default:
          console.warn(`WARNING: type of param not supported: ${typeof param}`)
          break;
      }

      packetSize += buffer.length
      packetParts.push(buffer)
    })

    const dataBuffer = Buffer.concat(packetParts, packetSize)
    const size = Buffer.alloc(1)
    size.writeUInt8(dataBuffer.length + 1, 0)

    return Buffer.concat([size, dataBuffer], size.length + dataBuffer.length)
  },

  // Parse packet to be handled by client
  parse: (data) => {
    let index = 0;
    console.log(`[PACKET] Received packet of size ${data.length}`)
    while(index < data.length) {
      const packetSize = data.readUInt8(index)
      const extracted = Buffer.alloc(packetSize)
      data.copy(extracted, 0, index, index + packetSize)
      interpret(extracted)
      index += packetSize
    }
  },
  interpret,
}
