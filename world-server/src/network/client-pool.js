const redis = require('redis')
const config = require('../../config')
const createRedisClient = require('../redis')

const { redis: { host, port } } = config

// TODO: Maybe, add a map for client ids, so it will cost less to loop throug it
let _instance
let _redisClient
class ClientPool {

  static getInstance() {
    if (!_instance) {
      const errMessage = "Client Pool - instance not defined. Please create an instance before using"
      console.error(errMessage)
      throw new Error(errMessage)
    } else {
      return _instance;
    }
  }

  static async create(redisClient) {
    if (!_instance) {
      if (!redisClient) {
        redisClient = await createRedisClient()
      }
      _instance = new ClientPool()
      //TODO: Maybe limit the size of the memory pool?
      _instance.pool = [] // RAM memory pool of clients for instant access
      _redisClient = redisClient
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

      client = await _redisClient.get(id)
      if (client) {
        console.log('CLient retrieved', client)
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
      await _redisClient.del(id)
      return true
    } catch (err) {
      console.error('[GAMEWORLD] Error while deleting client by id', err)
    }
    return false
  }

  async update(client) {
    try {
      const c = await _redisClient.get(client.id)
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
      await _redisClient.set(client.id, JSON.stringify(client))
      return true
    } catch (error) {
      console.error('[GAMEWORLD] Error while adding client to the pool', error)
    }
    return false
  }

}

module.exports = ClientPool
