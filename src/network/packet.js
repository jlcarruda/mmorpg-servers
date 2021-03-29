const Parser = require('./packet_parser')
const interpreters = require('../services/interpreters')
const { verify } = require('../services/utils/encrypt')
/**
 *  Socket packets on GMS is handled in this way: A long buffer with all packets (chunks) glued
 * 
 *   THe first byte of the BUFFER is its total size, so we know how much bytes to read  
 * 
 *   The first byte of the packet is its size, so we know how many bytes to read
 *   The last byte is a zero byte, to indicate the end of a packet.
 *   
 */

const zeroBuffer = Buffer.from('00', 'hex')

const interpret = (client, packet_parser, datapacket) => {
  let { command } = Parser.header.parse(datapacket)

  console.log(`[PACKET] Interpret: ${command}`)

  // If command is implemented
  if (interpreters[command.toUpperCase()]) {
    interpreters[command.toUpperCase()](client, packet_parser, datapacket)
  }
}

module.exports = packet = {
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
  parse: (client, data) => {
    let index = 0;

    while(index < data.length) {
      const packetSize = data.readUInt8(index)
      const extracted = Buffer.alloc(packetSize)
      data.copy(extracted, 0, index, index + packetSize)
      interpret(client, packet, extracted)
      index += packetSize
    }
  },
  interpret,
}
