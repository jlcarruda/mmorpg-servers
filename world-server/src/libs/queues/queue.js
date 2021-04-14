const now = require('performance-now')
const EventEmitter = require('events')
const { getClient } = require('../../repositories/redis')

let _client
class Queue extends EventEmitter {
  constructor(key, processor, client) {
    super()
    this.key = key
    this.processor = processor
    this.client = client || _client
    this.lock = false
  }


  static async create(key, processor) {
    if (!_client) {
      _client = await getClient(true, false)
    }

    return new Queue(key, processor)
  }

  async pop() {
    if (this.lock) {
      return false
    }
    try {
      const len = await _client.llen(this.key)
      if (len === 0) {
        this.lock = true
        return false
      }
      // Blocks the connection if there is not a key on the list
      // Resumes when there is another key
      const job = await _client.blpop(this.key, 30)
      if (!job) {
        this.lock = true
        return false
      }

      const resp = typeof job[1] === 'string' ? JSON.parse(job[1]) : job[1]
      this.emit('job popped', resp)
      return resp
    } catch(err) {
      throw err
    }
  }

  async push(job) {
    if (this.lock) {
      this.lock = false
    }
    try {
      await _client.rpush(this.key, JSON.stringify(job))
      this.emit('job pushed')
      return true
    } catch(err) {
      throw err
    }
  }

  process(processor) {
    const self = this
    this.pop().then(job => {
      // if (job.time && self.interval) {
      //   if (!self.tickTimeSignature) {
      //     self.tickTimeSignature = job.time
      //     self.process()
      //   } else if((job.time - self.tickTimeSignature) <= self.interval) {
      //     self.process()
      //   }
      // }
      if (processor) {
        processor(job)
      } else {
        self.processor(job)
      }

      self.emit('job processed')
    }).catch(err => {
      console.error('[QUEUE] Error while processing job', err)
    })
  }
}

module.exports = Queue
