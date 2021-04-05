const Queue = require('bee-queue')
const redis = require('redis')

const config = require('../config')

const { redis: {host, port} } = config

const sharedConfig = {
  redis: redis.createClient({
    host,
    port
  })
}

class WorldQueues {
  static queues = {};

  static async createQueue(name, processHandle) {
    if (!WorldQueues.queues[name]) {
      const q = new Queue(name, sharedConfig)
      WorldQueues.queues[name] = q
      q.process(processHandle)

      q.on('error', (err) => {
        console.log(`A queue error happened: ${err.message}`);
      });
    }

    return WorldQueues.queues[name].ready()
  }

  static getQueue(name) {
    return WorldQueues.queues[name]
  }

  static getQueues() {
    return WorldQueues.queues
  }

  static async createJob(queueName, data) {
    const q = WorldQueues.queues[queueName]
    try {
      if (q) {
        const job = await q.createJob({ ...data, queue: q }).save()
        job.on('retrying', () => console.log('[GAMEWORLD] Retrying job '))
        job.on('succeeded', () => console.log('[GAMEWORLD] Success job '))
      }
    } catch (err) {
      console.error('[GAMEWORLD] Could not create job: ', err)
    }
  }
}

module.exports = WorldQueues
