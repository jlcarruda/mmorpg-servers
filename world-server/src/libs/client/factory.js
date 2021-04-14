const { v4: uuidv4 } = require('uuid')
const Client = require('./client')
class ClientFactory {
  /**
   * Create a brand new client object
   * @param {net.Socket} socket - Socket object from a new connection
   */
  static create(socket) {
    //TODO: verify if socket is already in socket pool. If it is, do not create another client
    const blueprint = {
      socket: socket.id,
      character: null,
      user: null,
      charState: {},
      lastCharStateUpdate: null,
      lastUpdatedAt: Date.now().toString(),
      id: uuidv4(),
    }

    return new Client(blueprint)
  }

  /**
   * Deserializes the JSON that was stored on the Client Pool and transforms into an Object for better using
   * @param {string} clientSerialized - Serialized JSON object came from client pool
   * @returns {JSON} client object
   */
  static deserialize(clientSerialized) {
    return new Client(JSON.parse(clientSerialized))
  }

  /**
   * Used to serialize the client object into a saveable state for client pool
   * @param {JSON} client - client to be serialized
   * @returns {string} Serialized client
   */
  static serialize(client) {
    return client.serialize()
  }
}

module.exports = ClientFactory
