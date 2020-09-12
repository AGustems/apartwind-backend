const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    surname: {
        type: String,
        required: [true, 'The surname is required']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
        required: [true, 'The email is required'],
    },
    password: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        default: 'Not Specified'
    },
    imageUrl: {
        type: String,
        match: [
            /^(ftp|http|https):\/\/[^ "]+$/, 'Invalid url'
        ],
        default: 'https://res.cloudinary.com/agustems/image/upload/v1598692094/roomer/newUser_pmu8' +
                'bv.png'
    },
    age: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: "There isn't any description for this user yet."
    },
    characteristics: [String],
    socials: {
        facebook: {
            type: String,
            match: [
                /^(https?:\/\/){0,1}(www\.){0,1}facebook\.com/gm, 'Invalid Facebook address'
            ],
            default: 'No facebook account information provided'
        },
        twitter: {
            type: String,
            match: [
                /^(https?:\/\/){0,1}(www\.){0,1}twitter\.com/gm, 'Invalid Facebook address'
            ],
            default: 'No twitter account information provided'
        },
        instagram: {
            type: String,
            match: [
                /^(https?:\/\/){0,1}(www\.){0,1}instagram\.com/gm, 'Invalid Instagram address'
            ],
            default: 'No instagram account information provided'
        }
    },
    favourites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        }
    ],
    adverts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        }
    ]
}, {timestamps: true})

const User = mongoose.model('User', userSchema)
module.exports = User