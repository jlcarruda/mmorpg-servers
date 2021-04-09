const Queue = require('bee-queue')

class WorldQueues {
  static queues = {};

  static async createQueue(name, processHandle, config) {
    if (!WorldQueues.queues[name]) {
      const q = new Queue(name, {...config, isWorker: false })

      q.on('error', (err) => {
        console.log(`A queue error happened: ${err.message}`);
      });

      const qp = new Queue(name, config)

      qp.process(processHandle)

      WorldQueues.queues[name] = { queue: q, processor: qp }
    }
    return WorldQueues.queues[name].queue.ready()
  }

  static getQueue(name) {
    return WorldQueues.queues[name].queue
  }

  static getProcessor(name) {
    return WorldQueues.queues[name].processor
  }

  static getPool() {
    return WorldQueues.queues
  }

  static async createJob(queueName, data) {
    const q = WorldQueues.queues[queueName] && WorldQueues.queues[queueName].queue
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
