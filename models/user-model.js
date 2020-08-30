const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  occupation: String,
  age: Number,
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  description: String,
  characteristics: [String],
  socials:Object,
  favourites: {
    type: [Schema.Types.ObjectId],
    ref: 'Room'
  },
  adverts: {
    type: [Schema.Types.ObjectId],
    ref: 'Room'
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema)
module.exports = User