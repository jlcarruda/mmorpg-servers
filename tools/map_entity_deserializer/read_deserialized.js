const fs = require('fs')

const filePath = process.argv.slice(2)[0]
const _timer = 2000
console.log(`Reading converted file. Setting ${_timer/1000} seconds timeout to Writable Stream finishes write the file`)
setTimeout(() => {
  const deserialized = require(filePath)
  const _aux = filePath.split('_v')
  const versionType = _aux[_aux.length - 1]

  const { layers } = deserialized

  // Get the collision blocks
  const { instances } = layers.filter(l => l.name === 'blocks')[0]
  const collisionBlocks = instances.map(b => {
    const { x, y, scaleX, scaleY } = b
    return { x, y, scaleX, scaleY }
  })

  console.log(collisionBlocks)
  const response = {
    collisionBlocks
  }

  const writeStream = fs.createWriteStream(`./output/out_v${versionType}`)
  const writeBuffer = Buffer.from(JSON.stringify(response))

  writeStream.write(writeBuffer, (err) => {
    if (err) {
      console.error('an error ocurred on writing', err)
    }
  })

}, _timer)
