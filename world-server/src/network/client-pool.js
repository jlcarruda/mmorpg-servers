const { promisify } = require('util')

let _getAsync
let _setAsync
let _delAsync
// TODO: Maybe, add a map for client ids, so it will cost less to loop throug it
class ClientPool {
  static instance = undefined;

  static getInstance() {
    return ClientPool.instance;
  }

  static create(redisClient) {
    if (!ClientPool.instance) {
      const instance = new ClientPool()
      _getAsync = promisify(redisClient.get).bind(redisClient)
      _setAsync = promisify(redisClient.set).bind(redisClient)
      _delAsync = promisify(redisClient.del).bind(redisClient)
      ClientPool.instance = instance
    }

    return ClientPool.instance
  }

  async findById(id) {
    try {
      const client = await _getAsync(id) //this.pool.filter(c => c.id === id)[0]
      return client;
    } catch (err) {
      console.error('[GAMEWORLD] Error while retrieving client by id', err)
    }

    return false
  }

  remove(id) {
    try {
      await _delAsync(id)
      return true
    } catch (err) {
      console.error('[GAMEWORLD] Error while deleting client by id', err)
    }
    return false
    // let index = null;
    // this.pool.every((c, i) => {
    //   if (c.id === id) {
    //     index = i
    //     return false
    //   }

    //   return true
    // })

    // if (index !== null) {
    //   console.info(`[GAMEWORLD] Removing client ${id} from pool`)
    //   this.pool.slice(index, 1)
    // } else {
    //   console.info(`[GAMEWORLD] Client with ${id} id does not exist in pool`)
    // }
  }

  add(client) {
    try {
      await _setAsync(client.id, client)
      return true
    } catch (error) {
      console.error('[GAMEWORLD] Error while adding client to the pool', err)
    }
    return false
  }

}

module.exports = ClientPool
