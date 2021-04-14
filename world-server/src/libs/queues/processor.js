class Processor {
  constructor(queue, processHandle, interval = 0) {
    this.queue = queue
    this.processHandle = processHandle
    this.interval = interval
    this.resumingIntervalProcess = false
    if (this.interval > 0) {
      this.type = 'interval'
      this.start()
    } else {
      this.type = 'event'
      this.queue.on('job pushed', this._onJobPushed.bind(this))
    }
  }

  _onJobPushed() {
    this.queue.process(this.processHandle)
  }
  // Get the first job on queue (A)
      // Check the time of it (time = At)
      // process job A
      // get the next job (B)
      // get the job time (Bt)
      // checker function: compare diff Bt - time (which is At)
        // If diff <= interval
          // process B
          // get another job (C).
          // run checker again
      // If this.resumingIntervalProcess = false
        // cleatInterval(this._setInterval)

  setTimeInterval(msInterval) {
    this.interval = msInterval
    if (this.type === 'event') {
      this.queue.removeListener('job pushed', this._onJobPushed)
      this.type = 'interval'
    }
  }

  setEvent(onJobPushed = this._onJobPushed) {
    if (this.type === 'interval') {
      this.stop()
      this.interval = 0
    }
    this.queue.on('job pushed', onJobPushed)
  }

  runIntervalProcess(lastTime = false) {
    if (!this.resumingIntervalProcess) {
      return
    }
    // console.log('running interval')

    let _time = lastTime
    const self = this

    const isInsideInterval = (time, job) => Promise.resolve(job.time && (job.time - time) <= self.interval)

    this.queue.pop().then(job => {
      if (job) {
        self.processHandle(job)
        if (job.time) {
          if(!_time) {
            _time = job.time
            self.runIntervalProcess(_time)
          } else {
            return isInsideInterval(_time, job)
          }
        }
      }
    }).then(isInInterval => {
      if (isInInterval) {
        self.runIntervalProcess(_time)
      }
    })
  }

  stop() {
    this.resumingIntervalProcess = false
    clearInterval(this._setInterval)
  }

  start() {
    if (!this.resumingIntervalProcess) {
      this.resumingIntervalProcess = true
      this._setInterval = setInterval(this.runIntervalProcess.bind(this), this.interval)
    }
  }
}

module.exports = Processor
