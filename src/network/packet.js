const zeroBuffer = Buffer.from('00', 'hex')

module.exports = {
  build: (params) => {
    packetParts = []
    packetSize = 0

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
  }
}
