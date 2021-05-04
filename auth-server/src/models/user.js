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

schema.statics.register = async function(username, password) {
  try {

    const user = await this.create({
      username,
      password,
    })

    return user;
  } catch(err) {
    console.error("Error while trying to register User", err)
    throw err
  }
}

schema.statics.checkUsernameAvailability = async function(username) {
  try {
    const response = await this.exists({ username })
    return response;
  } catch(err) {
    console.error("Error while checking username availability", err)
  }
}

schema.statics.authenticate = async function(username, password) {
  try {
    const user = await this.findOne({ username })
    if (!user) {
      return
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return
    }

    user.last_login_at = new Date()
    await user.save()

    return user;
  } catch(err) {
    console.error("Error while authenticating User", err)
    throw err
  }
}

schema.methods.setCharacter = async function(character) {
  try {
    if (this.characters.length < 5) {
      this.characters = [
        ...this.characters,
        character
      ]

      await this.save()
    }
  } catch(err) {
    console.error("Error while setting character into user", err)
    throw err;
  }
}

module.exports = models.User || model('User', schema);
