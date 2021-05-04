const now = require('performance-now')
const sysTest = require('./systems/sys-test')
const { destroySocket } = require('../socket')

function tick() {

}

class Gameheart {

  static instance;

  static create(mSecTick, maxFps, maxSkippedFrames, update) {
    if (Gameheart.instance){
      console.log("Gameheart instance already exists")
      return Gameheart.instance
    }

    console.log("Creating Gameheart instance!")

    Gameheart.instance = new Gameheart()
    Gameheart.instance.mSecTick = mSecTick; // Milliseconds inbetween update ticks
    Gameheart.instance.maxFps = maxFps; // Cap on render actions per second (usually 60)
    // Gameheart.instance.mSecFrame = Math.floor(1000 / maxFps); // Milliseconds inbetween frames (when non are skipped) - calculated by maxFps
    Gameheart.instance.maxSkippedFrames = maxSkippedFrames; // Max render frames to be skipped before we draw another one in favor of "catching up" on ticks

    if(update) {
      Gameheart.instance.update_tick = update
    }
    // Gameheart.instance.update = update; // Update function (takes dt and t)
    // Gameheart.instance.render = render; // Render function (takes dt)

    Gameheart.instance.nextTick = 0; // Timestamp of the next tick to process
    // Gameheart.instance.nextFrame; // Timestamp of the next render frame to process
    // Gameheart.instance.lastFrame; // Timestamp for last rendered frame
    // Gameheart.instance.fps; // Calculated fps for actual rendering

    Gameheart.instance.clients = {};

    return Gameheart.instance;
  }

  static getInstance(mSecTick, maxFps, maxSkippedFrames, update) {
    if (!Gameheart.instance) {
      return Gameheart.create(mSecTick, maxFps, maxSkippedFrames, update)
    }
    console.log("Gameheart instance already exists.")
    return Gameheart.instance
  }

  start() {
    let currentTime = now()
    this.nextTick = currentTime + this.mSecTick;
    this.update()
  }


  addClient(client) {
    if (!client.token) {
      return;
    }
    this.clients[client.token] = client
  }

  removeClient(token) {
    let client = this.clients[token]

    if (client) {
      destroySocket(client, 5)
    }

    delete this.clients[token]
  }

  clientsConnected() {
    return Object.keys(this.clients).length
  }

  update() {
    if (this.update_tick) {
      this.update_tick(this)
    } else {
      // TODO: implemented the update function for each tick
    }
  }
}


module.exports = Gameheart
