const { getClient } = require('../../repositories/redis')
const queueFactory = require('./queue.factory')
const jobFactory = require('./job.factory')

let _instance;
class Queues {

  static create() {
    if (!_instance) {
      _instance = new Queues()
      _instance.queues = {}
    }

    return _instance;
  }

  /**
   * @returns {Queues} - Instance of Queues class
   */
  static getInstance() {
    if (!_instance) {
      Queues.create()
    }

    return _instance
  }

  /**
   * This method will create a queue and processor for the given name.
   * @param {string} name - Name of the queue
   * @param {*} processHandle - Process function
   * @param {*} config - extra configuration
   */
  async createQueue(name, processHandle, { interval } = { interval: 0 }) {
    try {
      console.log(`[GAMEWORLD] Creating queue ${name}`)
      if (!this.queues[name]) {
        this.queues[name] = await queueFactory.create(name, processHandle, interval)
      }

      return this.queues[name].queue
    } catch(err) {
      console.error('[QUEUE] Error while trying to reate queue', err)
      throw err
    }
  }

  getQueue(name) {
    return this.queues[name]
  }

  getPool() {
    return this.queues
  }

  async createJob(queueName, data) {
    const q = this.queues[queueName] && this.queues[queueName].queue
    try {
      if (q) {
        await q.push(data)
        // await jobFactory.create(q, { ...data })
      }
    } catch(err) {
      console.error('[GAMEWORLD] Could not create job: ', err)
    }
  }
}

module.exports = Queues
