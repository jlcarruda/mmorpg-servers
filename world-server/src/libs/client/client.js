class Client {
  constructor({
    socket,
    character,
    user,
    charState,
    lastCharStateUpdate,
    lastUpdatedAt,
    id,
    token
  }) {
    this.socket = socket
    this.character = character
    this.user = user
    this.charState = charState
    this.lastCharStateUpdate = lastCharStateUpdate
    this.lastUpdatedAt = lastUpdatedAt
    this.id = id
    this.token = token;

    this._state = {
      socket,
      character,
      user,
      charState,
      lastCharStateUpdate,
      lastUpdatedAt,
      id,
      token
    }
  }

  set(key, value) {
    if (this[key] !== undefined) {
      this[key] = this._state[key] = value
      this.lastUpdatedAt = this._state.lastUpdatedAt = new Date()
    }
  }

  serialize() {
    return JSON.stringify(this._state)
  }

  async onError(err) {
    console.log("[SOCKET] Error on socket connection", err)
    await this._persist()
  }

  async onEnd() {
    await this._persist()
  }

  onData(data) {
    const { parse } = require('../network/packet')
    parse(data)
  }

  async _persist() {
    if (!this.character) {
      console.log('[GAMEWORLD] No character selected. Skipping persist step.')
      return
    }
    const { Character } = require('../../models')
    const ClientPool = require('./pool')
    const { users } = require('../../connectors/rest_connector')
    const pool = await ClientPool.getInstance()
    await pool.remove(this.id)

    await users.logout(this.user.id, this.id, this.token)
    await Character.findByIdAndUpdate(this.character._id, this.character)
  }
}

module.exports = Client
