const { Schema, models, model } = require('mongoose')

const PositionSchema = new Schema({
  x: Number,
  y: Number,
  current_room: String,
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
    enum: [ "player", "mod", "gm", "creator" ]
  },
  position: PositionSchema
})

module.exports = models.Character || model('Character', schema)
