const Parser = require('./packet_parser')
const interpreters = require('../services/interpreters')
const { verify } = require('../services/utils/encrypt')
/**
 *  Socket packets on GMS is handled in this way: 
 *   - A long buffer with all packets glued
 *   
 *   The first byte of the packet is its size, so we know how many bytes to read
 */

const zeroBuffer = Buffer.from('00', 'hex')

const interpret = (client, packet_parser, datapacket) => {
  let header = Parser.header.parse(datapacket)

  console.log(`[PACKET] Interpret: ${header.command}`)

  // If command is implemented
  if (interpreters[header.command.toUpperCase()]) {
    interpreters[header.command.toUpperCase()](client, packet_parser, datapacket)
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
          buffer = Buffer.alloc(2)
          buffer.writeUInt16LE(param, 0)
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
