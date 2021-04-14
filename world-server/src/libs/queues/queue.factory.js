const Queue = require('./queue')
const Processor = require('./processor.js')

//TODO: test without bee-queue
/**
 * Genesis function for creating a Queue and Processor
 * @param {*} name - Name of the queue
 * @param {*} processHandle - Process function
 * @param {*} config - Extra configuration
 * @param {*} client - Storage Client
 * @returns {{queue, processor}} Returns an object with queue and processor
 */
const create = async (name, processHandle, interval = 0) => {
  const q = await Queue.create(name, processHandle)
  const p = new Processor(q, processHandle, interval)
  return { queue: q, processor: p }
  // })
}
module.exports = {
  create
}
