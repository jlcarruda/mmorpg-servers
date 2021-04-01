const startingTown = require('./starting_town.json')
const startingTownSewer = require('./starting_town_sewer.json')


module.exports = {
  startingTown: { ...startingTown, clients: [] },
  startingTownSewer: { ...startingTownSewer, clients: [] }
}
