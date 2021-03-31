const request = require('axios')
const config = require('../../config')

module.exports = {
  users: {
    getUser: async (userId, token, { rest: baseUrl } = config.connectors) => {
      try {
        const response = await request.get({
          url: `/users/${userId}`,
          baseUrl,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        return response
      } catch(err) {
        console.error("[GAMEWORLD] Failed to reach Rest server")
      }
    }
  }
}
