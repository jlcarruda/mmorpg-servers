const Queue = require('bee-queue')

//TODO: test without bee-queue
/**
 * Genesis function for creating a Queue and Processor
 * @param {*} name - Name of the queue
 * @param {*} processHandle - Process function
 * @param {*} config - Extra configuration
 * @param {*} client - Storage Client
 * @returns {{queue, processor}} Returns an object with queue and processor
 */
const create = (name, processHandle, config, client) => {
  const q = new Queue(name, {...config, redis: client, isWorker: false })

  q.on('error', (err) => {
    console.error(`A queue error happened while creating queue ${name}: ${err.message}`);
  });

  const qp = new Queue(name, { ...config, redis: client })

  qp.on('error', (err) => {
    console.error(`A queue error happened while creating worker queue ${name}: ${err.message}`);
  });

  qp.process(processHandle)

  return { queue: q, processor: qp }
}

module.exports = {
  create
}
