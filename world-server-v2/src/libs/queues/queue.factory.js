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
const create = async (name, processHandle, config, client) => {
  const q = await createQueue(name, {...config, redis: client, isWorker: false })
  const qp = await createQueue(name, {...config, redis: client })

  qp.process(processHandle)

  // return new Promise((resolve, reject) => {
    // const q = new Queue(name, {...config, redis: client, isWorker: false })
    // const qp = new Queue(name, { ...config, redis: client })

    // q.on('error', (err) => {
    //   console.error(`A queue error happened while creating queue ${name}: ${err.message}`);
    //   reject(err)
    // });
    // qp.on('error', (err) => {
    //   console.error(`A queue error happened while creating worker queue ${name}: ${err.message}`);
    //   reject(err)
    // });

    // qp.process(processHandle)
    return { queue: q, processor: qp }
  // })
}

function createQueue(name, config) {
  return new Promise((resolve, reject) => {
    const q = new Queue(name, config)

    q.on('error', (err) => {
      console.error(`A queue error happened while creating queue ${name}: ${err.message}`);
      reject(err)
    });

    q.on('ready', () => {
      console.log(`Queue named ${name} created and ready`)
      resolve(q)
    })
  })
}

module.exports = {
  create
}
