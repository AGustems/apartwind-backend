const express = require('express')
const roomRoutes = express.Router()
const uploader = require('../configs/cloudinary-config')
const User = require('../models/user-model')
const Room = require('../models/room-model')
const {transporter, offerSend, offerMade, offerDelete, offerWarning} = require('../configs/nodemailer-config');

// ROOMS ROUTE
roomRoutes.get('/', async(req, res, next) => {
    // Return all the rooms in the database
    try {
        const rooms = await Room
            .find()
            .populate('owner');

        if (rooms.length < 0) {
            res
                .status(404)
                .json({message: "There are no rooms available at the moment"})
            return
        }

        res
            .status(200)
            .json(rooms)
    } catch (error) {
        res
            .status(500)
            .json({message: "Error when trying to retrieve all the rooms available"})
        next(error)
    }
})

// SPECIFIC ROOM ROUTE
roomRoutes.get('/:id', async(req, res, next) => {
    // Return the room with the id sent as a parameter on the URL
    try {
        const room = await Room
            .findOne({_id: req.params.id})
            .populate("owner")

        if (room === {}) {
            res
                .status(500)
                .json({message: 'Error while trying to retrieve the room information'})
            return
        }

        res
            .status(200)
            .json(room)
    } catch (error) {
        res
            .status(500)
            .json({message: 'Error while trying to retrieve the room information'})
        next(error)
    }
})

// ADD ROOM ROUTE
roomRoutes.post('/add', uploader.array('images'), async(req, res, next) => {
    // Putting the paths of the images inside an array
    const images = []
    if (req.files) {
        const files = req.files
        for (let i = 0; i < files.length; i++) {
            images.push(files[i].path)
        }
    }

    // Checking if the body of the images is empty and pushing a default picture if
    // it is
    if (req.body.images == []) {
        images.push('https://res.cloudinary.com/agustems/image/upload/v1598881434/roomer/no-image_klm' +
                'dah.png')
    }

    // Saving the required data into variables
    const owner = req.body.owner
    const property = req.body.property
    const location = JSON.parse(req.body.location)
    const price = req.body.price
    const size = req.body.size
    const bedrooms = req.body.bedrooms
    const bathrooms = req.body.bathrooms

    // Sending feedback if the required data is missing
    if (owner === '' || property === '' || price === '' || size === '' || bedrooms === '' || bathrooms === '') {
        res
            .status(400)
            .json({message: 'Please, provide all the required information'})
        return
    }

    // Checking that at least there is one bedroom and one bathroom
    if (bedrooms < 1 || bathrooms < 1) {
        res
            .status(400)
            .json({message: 'There has to be at least one bedroom and one bathroom in the building'})
        return
    }

    // Checking if the location sended is not the default one
    if (location.direction === '' || location.lat == 0 && location.lng == 0) {
        res
            .status(400)
            .json({message: 'Plese, provide a valid address'})
        return
    }

    // Checking if a date has been submitted and adding one if not
    let availability = req.body.availability
    if (availability == null) {
        availability = JSON.parse(req.body.availability)
    } else {
        availability = new Date()
    }

    // Saving the non required data into variables
    const amenities = JSON.parse(req.body.amenities)
    const flatmates = JSON.parse(req.body.flatmates)
    const pets = req.body.pets
    const smokers = req.body.smokers
    const tolerance = JSON.parse(req.body.tolerance)
    const title = req.body.title
    const description = req.body.description

    // Creation of the new room
    const newRoom = new Room({
        owner: owner,
        property: property,
        location: location,
        images: images,
        price: price,
        size: size,
        availability: availability,
        amenities: amenities,
        flatmates: flatmates,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        pets: pets,
        smokers: smokers,
        tolerance: tolerance,
        title: title,
        description: description,
        offers: []
    })

    // Saving the new room into the database
    await newRoom.save(err => {
        if (err) {
            console.log(err)
            res
                .status(500)
                .json({message: 'Something went wrong while saving the room into de database'})
            return;
        }

        // Sending the room information to the frontend
        res
            .status(200)
            .json(newRoom)
    })

    // Updating the owner information of the rooms array
    try {
        // Find the Rooms that the owner has created the room
        const findRooms = await Room.find({owner: owner})
        const roomIds = []
        findRooms.map(item => roomIds.push(item._id))

        // Updating the user with the new info
        const updateUser = await User.findOneAndUpdate({
            _id: owner
        }, {
            adverts: roomIds
        }, {new: true})
    } catch (err) {
        res
            .status(500)
            .json({message: "Error while updating the user's information"})
        next(error)
    }
})

// PATCH ROOM ROUTE
roomRoutes.patch('/:id', async(req, res, next) => {
    const userId = req.body.userId
    const roomId = req.params.id

    const user = await User.findOne({_id: userId})

    try {
        let newFav = user.favourites
        if (newFav === []) {
            newFav = [roomId]
        } else if (newFav.includes(roomId)) {
            newFav.splice((newFav.indexOf(roomId)), 1)
        } else {
            newFav.push(roomId)
        }

        const updateUser = await User.findOneAndUpdate({
            _id: userId
        }, {
            favourites: newFav
        }, {new: true})

        res
            .status(200)
            .json(updateUser)
    } catch (error) {
        res
            .status(500)
            .json({message: "Error while updating the favourites information"})
        next(error)
    }

})

// UPDATE ROOM ROUTE
roomRoutes.put('/:id/edit', uploader.array("images"), async(req, res, next) => {
    // Checking if more images have been sent and adding the new ones
    let images = JSON.parse(req.body.oldImages)

    if (req.files) {
        if (images[0] === 'https://res.cloudinary.com/agustems/image/upload/v1598881434/roomer/no-image_klm' +
                'dah.png') {
            images = []
        }
        const files = req.files
        for (let i = 0; i < files.length; i++) {
            images.push(files[i].path)
        }
    }

    // Saving the required data into variables
    const updateData = req.body
    const property = req.body.property
    const location = JSON.parse(req.body.location)
    const price = req.body.price
    const size = req.body.size
    const bedrooms = req.body.bedrooms
    const bathrooms = req.body.bathrooms

    // Saving the images and making the necessary tranformation because of the new
    // FormData in the frontend
    const amenities = JSON.parse(req.body.amenities)
    const flatmates = JSON.parse(req.body.flatmates)
    const tolerance = JSON.parse(req.body.tolerance)
    updateData.amenities = amenities
    updateData.flatmates = flatmates
    updateData.tolerance = tolerance
    updateData.location = location
    updateData.images = images

    //Checking if the required data has been sent
    if (property === '' || price === '' || size === '' || bedrooms === '' || bathrooms === '') {
        res
            .status(400)
            .json({message: 'Please, provide all the required information'})
        return
    }

    // Checking that at least there is one bedroom and one bathroom
    if (bedrooms < 1 || bathrooms < 1) {
        res
            .status(400)
            .json({message: 'There has to be at least one bedroom and one bathroom in the building'})
        return
    }

    // Finding the room and updating it with the information sent
    try {
        const updateRoom = await Room.findOneAndUpdate({
            _id: req.params.id
        }, updateData, {new: true})
        res
            .status(200)
            .json(updateRoom)
    } catch (error) {
        res
            .status(500)
            .json({message: "Error while updating the room's information"})
        next(error)
    }
})

// DELETE ROOM ROUTE
roomRoutes.delete('/:id/delete', (req, res, next) => {
    Room.findOneAndDelete({
        _id: req.params.id
    }, (err, docs) => {
        if (err) {
            res
                .status(500)
                .json({message: "Error while trying to delete the room"})
            return
        } else {
            res
                .status(200)
                .json({message: "The following room has been errased: ", docs})
        }
    }, {new: true})
})

// SEARCH FOR ALL THE ROOMS THAT AN SPECIFIC USER POSTED
roomRoutes.get('/userAds/:id', async(req, res, next) => {
    try {
        const findAds = await Room
            .find({owner: req.params.id})
            .populate("owner")
            .populate({
                path: "offers",
                populate: {
                    path: "offeror"
                }
            })

        res
            .status(200)
            .json(findAds)
    } catch (error) {
        res
            .status(500)
            .json({message: 'Error while trying to retrieve the ads information'})
    }
})

// SEARCH FOR THE OFFERS THAT AN SPECIFIC USER MADE
roomRoutes.get('/userOffers/:id', async(req, res, next) => {
    try {
        const findOffers = await Room
            .find({"offers.offeror": req.params.id})
            .populate("owner")

        res
            .status(200)
            .json(findOffers)
    } catch (error) {
        res
            .status(500)
            .json({message: 'Error while trying to retrieve the offers information'})
        next(error)
    }
})

// POST AN OFFER AND SEND AN EMAIL
roomRoutes.put('/:id/newOffer', async(req, res, next) => {
    try {
        // Save the required data into variables and checking if it's correct
        const offerorData = req.body.userId
        const offerorMessage = req.body.message

        if (offerorData === '' || offerorMessage === '') {
            res
                .status(400)
                .json({message: 'Please, provide all the required information'})
            return
        }

        // Save the data for the offer (userId and message)
        const newOffer = {
            offeror: offerorData,
            message: offerorMessage
        }

        // Find the offeror data
        const offeror = await User.findOne({_id: req.body.userId})

        // Find the advertised room data push the offer
        const room = await Room
            .findOne({_id: req.params.id})
            .populate("owner")
            .populate({
                path: "offers",
                populate: {
                    path: "offeror"
                }
            })

        // Check if the user has already made an offer
        let offerIndex = -1;

        for (let i = 0; i < room.offers.length; i++) {
            if (room.offers[i].offeror == req.body.userId) {
                offerIndex = i
            }
        }

        if (offerIndex === -1) {
            room
                .offers
                .push(newOffer)
        } else {
            res
                .status(400)
                .json({message: 'You already posted an offer for this advert'})
            return
        }

        // Update the room array of offers
        const roomUpdate = await Room.findOneAndUpdate({
            _id: req.params.id
        }, room, {new: true}).populate("owner")

        // Send email to the room owner
        const mailR = await transporter.sendMail({
            from: process.env.GMAIL_ACCOUNT,
            to: room.owner.email,
            subject: "Someone is interested in your room!",
            html: offerSend(offeror, room, req.body.message)
        }, (error, info) => error
            ? console.log(error)
            : console.log('Email sent: ' + info.response))

        // Send email to the offeror to have the data
        const mailO = await transporter.sendMail({
            from: process.env.GMAIL_ACCOUNT.email,
            to: offeror.email,
            subject: "You sent an offer for a room!",
            html: offerMade(offeror, room, req.body.message)
        }, (error, info) => error
            ? console.log(error)
            : console.log('Email sent: ' + info.response))

        // Send the updated data to the frontend
        res
            .status(200)
            .json(roomUpdate)
    } catch (error) {
        res
            .status(500)
            .json({message: 'Error while trying to post the offer'})
        next(error)
    }
})

// ERRASE-REMOVE AN OFFER MADE
roomRoutes.put('/:id/deleteOffer', async(req, res, next) => {
    try {
        // Search for the room that the user did the offer
        const room = await Room
            .findOne({_id: req.params.id})
            .populate("owner")

        // Search for the user that wants to retrieve the offer
        const user = await User.findOne({_id: req.body.userId})

        // Search for the index of the offer that the user did
        let offerIndex = -1;

        for (let i = 0; i < room.offers.length; i++) {
            if (room.offers[i].offeror == req.body.userId) {
                offerIndex = i
            }
        }

        // Sent an error if the user's offer was not found
        if (offerIndex === -1) {
            res
                .status(400)
                .json({message: "The room offer was not found"})
            return
        }

        // Take out the offer from the offers array
        room
            .offers
            .splice(offerIndex, 1)

        // Update the room with the new array
        const roomUpdate = await Room.findByIdAndUpdate({
            _id: req.params.id
        }, room, {new: true}).populate("owner")

        // Send an email to the advertiser warning him
        const mailAD = await transporter.sendMail({
            from: process.env.GMAIL_ACCOUNT,
            to: room.owner.email,
            subject: "The offer that you made was retrieved",
            html: offerDelete(roomUpdate)
        }, (error, info) => error
            ? console.log(error)
            : console.log('Email sent: ' + info.response))

        // Send an email to the offeror warning him
        const mailOD = await transporter.sendMail({
            from: process.env.GMAIL_ACCOUNT,
            to: user.email,
            subject: "An offer to your advert was retrieved",
            html: offerWarning(user, roomUpdate)
        }, (error, info) => error
            ? console.log(error)
            : console.log('Email sent: ' + info.response))

        //Send the updated data to the frontend
        res
            .status(200)
            .json(roomUpdate)

    } catch (error) {
        res
            .status(500)
            .json({message: 'Error while trying to remove the offer'})
        next(error)
    }
})

module.exports = roomRoutes