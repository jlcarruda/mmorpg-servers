const { getClient } = require('../../repositories/redis')

let _storageClient
let _instance
class ClientPool {

  static getInstance() {
    if (!_instance) {
      const errMessage = "[CLIENT POOL] - instance not defined. Please create an instance before using"
      console.error(errMessage)
      ClientPool.create()
    } else {
      return _instance;
    }
  }

  static create(storageClient) {
    if (!_instance) {
      if (!storageClient) {
        storageClient = await getClient()
      }

      _instance = new ClientPool()
      _instance.pool = []
      _storageClient = storageClient
    }

    return _instance
  }

  poolGet(id) {
    return this.pool.find(c => c.id === id)
  }

  poolIndex(id) {
    return this.pool.findIndex(c => c.id === id)
  }

  poolAdd(client) {
    if (this.poolIndex(client.id) === -1) {
      this.pool.push(client)
    }
  }

  poolRemove(id) {
    const index = this.poolIndex(id)

    if (index >= 0) {
      this.pool.splice(index, 1)
    }
  }

  poolUpdate(client) {
    const index = this.poolIndex(client.id)
    if (index >= 0) {
      this.pool[index] = client
    }
  }

  async findById(id) {
    try {
      // Check if pool already has the client
      let client = this.poolGet(id)
      if (client) {
        return client;
      }

      client = await _storageClient.get(id)
      if (client) {
        this.poolAdd(client)
        return JSON.parse(client);
      }
      return false
    } catch (err) {
      console.error('[GAMEWORLD] Error while retrieving client by id', err)
    }

    return false
  }

  async remove(id) {
    try {
      this.poolRemove(id)
      await _storageClient.del(id)
      return true
    } catch (err) {
      console.error('[GAMEWORLD] Error while deleting client by id', err)
    }
    return false
  }

  async update(client) {
    try {
      const c = await _storageClient.get(client.id)
      if (c) {
        this.poolUpdate(client)
        //TODO: Check performance of this block
        const today = new Date()
        const lastUpdate = new Date(c.lastUpdatedAt)
        const diffTime = Math.abs(today - lastUpdate)
        if (Math.ceil(diffTime / (1000 * 60) >= 5)) { // 5 minutes
          await redis.set(client.id, JSON.stringify(client))
        }
        return true
      }
    } catch(err) {
      console.error('[GAMEWORLD] Error while updating client to the pool', err)
    }

    return false
  }

  async add(client) {
    try {
      this.poolAdd(client)
      await _storageClient.set(client.id, JSON.stringify(client))
      return true
    } catch (error) {
      console.error('[GAMEWORLD] Error while adding client to the pool', error)
    }
    return false
  }
}

module.exports = ClientPool
