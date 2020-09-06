const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'You need to be logged in to post an advert']
    },
    property: {
        type: String,
        enum: [
            'House', 'Flat', 'Other'
        ],
        required: [true, 'You need to specify the property type']
    },
    location: {
        lat: {
            type: String,
            required: [true, 'You need to specify the property location']
        },
        lng: {
            type: String,
            required: [true, 'You need to specify the property location']
        },
        direction: {
            type: String,
            required: [true, 'You need to specify the property location']
        }
    },
    images: {
        type: [String],
        match: [
            /^(ftp|http|https):\/\/[^ "]+$/, 'Invalid url'
        ],
        default: ['https://res.cloudinary.com/agustems/image/upload/v1598881434/roomer/no-image_klm' +
                'dah.png']
    },
    price: {
        type: Number,
        required: [true, 'You need to specify the monthly rent']
    },
    size: {
        type: String,
        enum: [
            'individual', 'double'
        ],
        required: [true, 'You need to specigy the room size']
    },
    availability: Date,
    amenities: {
        living: {
            type: Boolean,
            default: false
        },
        internet: {
            type: Boolean,
            default: false
        },
        parking: {
            type: Boolean,
            default: false
        },
        balcony: {
            type: Boolean,
            default: false
        },
        garden: {
            type: Boolean,
            default: false
        },
        dacces: {
            type: Boolean,
            default: false
        }
    },
    flatmates: {
        type: [Number],
        default: [0, 0]
    },
    bedrooms: {
        type: Number,
        required: true,
        match: [/^(?:[1-9]\d+|[1-9])$/gm, 'There has to be at least one bedroom']
    },
    bathrooms: {
        type: Number,
        required: true,
        match: [/^(?:[1-9]\d+|[1-9])$/gm, 'There has to be at least one bathroom']
    },
    pets: {
        type: Boolean,
        default: false
    },
    smokers: {
        type: Boolean,
        default: false
    },
    tolerance: {
        guys: {
            type: Boolean,
            default: false
        },
        girls: {
            type: Boolean,
            default: false
        },
        couples: {
            type: Boolean,
            default: false
        },
        smokers: {
            type: Boolean,
            default: false
        },
        students: {
            type: Boolean,
            default: false
        },
        pets: {
            type: Boolean,
            default: false
        }
    },
    title: {
        type: String,
        default: 'No title was provided'
    },
    description: {
        type: String,
        default: 'No description was provided'
    }
}, {timestamps: true})

const Room = mongoose.model('Room', roomSchema)
module.exports = Room