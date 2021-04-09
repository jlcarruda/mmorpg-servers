const { promisify } = require('util')
const redis = require('redis')
const config = require('../../config')
const createRedisClient = require('../redis')

const { redis: { host, port } } = config

let _getAsync
let _setAsync
let _delAsync
// TODO: Maybe, add a map for client ids, so it will cost less to loop throug it
class ClientPool {
  static instance;

  static getInstance() {
    if (!ClientPool.instance) {
      const errMessage = "Client Pool - instance not defined. Please create an instance before using"
      console.error(errMessage)
      // ClientPool.create(await redisClient())
      throw new Error(errMessage)
    } else {
      return ClientPool.instance;
    }
  }

  static async create(redisClient) {
    if (!ClientPool.instance) {
      if (!redisClient) {
        redisClient = await createRedisClient()
      }
      ClientPool.instance = new ClientPool()
      _getAsync = promisify(redisClient.get).bind(redisClient)
      _setAsync = promisify(redisClient.set).bind(redisClient)
      _delAsync = promisify(redisClient.del).bind(redisClient)
      //TODO: Maybe limit the size of the memory pool?
      ClientPool.instance.pool = [] // RAM memory pool of clients for instant access
    }

    return ClientPool.instance
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

      client = await _getAsync(id)
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
      await _delAsync(id)
      return true
    } catch (err) {
      console.error('[GAMEWORLD] Error while deleting client by id', err)
    }
    return false
  }

  async update(client) {
    try {
      const c = await _getAsync(client.id)
      if (c) {
        this.poolUpdate(client)
        //TODO: Check performance of this block
        const today = new Date()
        const lastUpdate = new Date(c.lastUpdatedAt)
        const diffTime = Math.abs(today - lastUpdate)
        if (Math.ceil(diffTime / (1000 * 60) >= 5)) { // 5 minutes
          await _setAsync(client.id, JSON.stringify(client))
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
      await _setAsync(client.id, JSON.stringify(client))
      return true
    } catch (error) {
      console.error('[GAMEWORLD] Error while adding client to the pool', err)
    }
    return false
  }

}

module.exports = ClientPool
