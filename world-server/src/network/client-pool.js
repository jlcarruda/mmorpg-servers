const Client = require('../client')

// TODO: Maybe, add a map for client ids, so it will cost less to loop throug it
class ClientPool {
  static instance;

  static getInstance() {
    if (!ClientPool.instance) {
      ClientPool.create()
    }

    return ClientPool.instance;
  }

  static create() {
    if (!ClientPool.instance) {
      const instance = new ClientPool()
      instance.pool = []
      ClientPool.instance = instance
    }

    return ClientPool.instance
  }

  findById(id) {
    const client = this.pool.filter(c => c.id === id)[0]
    return client;
  }

  remove(id) {
    let index = null;
    this.pool.every((c, i) => {
      if (c.id === id) {
        index = i
        return false
      }

      return true
    })

    if (index) {
      this.pool.slice(index, 1)
    }
  }

  add(client) {
    if (client instanceof Client) {
      this.pool.push(client)
    }
  }

  destroy(id) {
    const client = this.findById(id)
    if (client) {
      this.remove(id)
    }
  }
}

module.exports = ClientPool
