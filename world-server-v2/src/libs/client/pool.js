const { getClient } = require('../../repositories/redis')
const Factory = require('./factory')

let _storageClient
let _instance
let _maxClients = 50
/**
 * Singleton class that will handle the connected clients pool
 */
class ClientPool {

  /**
   * Retrieve the already created instance of ClientPool.
   * If not created, it calls `.create()`
   * @returns {Promise<ClientPool>}
   */
  static async getInstance() {
    if (!_instance) {
      const errMessage = "[CLIENT POOL] - instance not defined. Please create an instance before using"
      console.error(errMessage)
      await ClientPool.create()
    }

    return _instance;
  }

  /**
   * Create the ClientPool instance.
   * If its already created, returns the singleton instance.
   * If not, it will create a new one.
   *
   * If `storageClient` is not passed, it will use the default client
   * @param {} storageClient - an object that handles the storage of client objects
   */
  static async create(storageClient) {
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

  /**
   * Retrieves the client object from the pool
   * @param {string} id - Client Identifier
   * @returns {Promise<boolean | JSON>} The Client object. If fails, returns a `false`
   */
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
        return Factory.deserialize(client);
      }
      return false
    } catch (err) {
      console.error('[GAMEWORLD] Error while retrieving client by id', err)
    }

    return false
  }

  /**
   * Removes the client from the pool
   * @param {string} id - Client Identifier
   * @returns {Promise<boolean>} indicates if the operation succeeded or not
   */
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

  /**
   * Update the client object in the pool.
   * It will rewrite all the object in which its key (`id`) matched.
   * @param {string | JSON} client - Client object
   * @returns {Promise<boolean>} indicates if the operation succeeded or not
   */
  async update(client) {
    try {
      if (typeof client === 'string') {
        client = Factory.deserialize(client)
      }
      const c = await _storageClient.get(client.id)
      if (c) {
        this.poolUpdate(client)
        //TODO: Check performance of this block
        const today = new Date()
        const lastUpdate = new Date(c.lastUpdatedAt)
        const diffTime = Math.abs(today - lastUpdate)
        if (Math.ceil(diffTime / (1000 * 60) >= 5)) { // 5 minutes
          await _storageClient.set(client.id, Factory.serialize(client))
        }
        return true
      }
    } catch(err) {
      console.error('[GAMEWORLD] Error while updating client to the pool', err)
    }

    return false
  }

  /**
   * Add the object into the pool of clients, serializing it first
   * @param {JSON} client - Client object to be saved on pool
   * @returns {boolean} indicates if the operation succeeded or not
   */
  async add(client) {
    try {
      this.poolAdd(client)
      await _storageClient.set(client.id, Factory.serialize(client))
      return true
    } catch (error) {
      console.error('[GAMEWORLD] Error while adding client to the pool', error)
    }
    return false
  }
}

module.exports = ClientPool
