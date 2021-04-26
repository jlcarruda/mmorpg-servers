const { Schema, models, model } = require('mongoose')
const bcrypt = require('bcrypt')

const schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  client: {
    type: String
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  characters: [{ type: Schema.ObjectId, ref: 'Character' }],
  last_login_at: {
    type: Date,
    default: new Date()
  }
}, {
  timestamps: true
})

schema.pre('save', async function(next) {
  if (this.isModified) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10)
    }

    this.updated_at = new Date()
  }

  next();
})

module.exports = models.User || model('User', schema);
