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
  imageUrl: {
    type: String,
    default: 'https://res.cloudinary.com/agustems/image/upload/v1598692094/roomer/newUser_pmu8bv.png'
  },
  age: Number,
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