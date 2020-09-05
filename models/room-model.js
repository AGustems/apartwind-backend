const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  owner:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: String,
    enum : ['House','Flat','Other'],
    required: true
  },
  location: {
    type: Object,
  },
  images: {
    type: [String],
    default: ['https://res.cloudinary.com/agustems/image/upload/v1598881434/roomer/no-image_klmdah.png']
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    enum: ['individual', 'double'],
    required: true
  },
  availability: Date,
  amenities: {
    living: Boolean,
    internet: Boolean,
    parking: Boolean,
    balcony: Boolean,
    garden: Boolean,
    dacces: Boolean
  },
  flatmates: {
    type: [Number],
    default: [0,0]
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true 
  },
  pets: Boolean,
  smokers: Boolean,
  tolerance: {
    guys: Boolean,
    girls: Boolean,
    couples: Boolean,
    smokers: Boolean,
    students: Boolean,
    pets: Boolean
  },
  title: String,
  description: String
})

const Room = mongoose.model('Room', roomSchema)
module.exports = Room