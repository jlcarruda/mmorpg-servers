const { Schema, models, model } = require('mongoose')

const PositionSchema = new Schema({
  x: Number,
  y: Number,
  current_room: String,
}, {
  _id: false
})

const ValuesSchema = new Schema({
  hp: {
    type: Number,
    default: 100
  },
  max_hp: {
    type: Number,
    default: 100
  },
  stamina: {
    type: Number,
    default: 100
  },
  max_stamina: {
    type: Number,
    default: 100
  }
}, {
  _id: false
})

const schema = new Schema({
  name: {
    type: String,
    max: 16,
    min: [4, "Character name is too short"],
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: [ "player", "mod", "gm", "creator" ],
    default: "player"
  },
  position: PositionSchema,
  values: ValuesSchema,
})

module.exports = models.Character || model('Character', schema)
