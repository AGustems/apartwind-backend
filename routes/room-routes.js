const express = require('express')
const roomRoutes = express.Router()
const uploader = require('../configs/cloudinary-config')
const User = require('../models/user-model')
const Room = require('../models/room-model')

// ROOMS ROUTE
roomRoutes.get('/', async(req, res, next) => {
    // Return all the rooms in the database
    try {
        const rooms = await Room
            .find()
            .populate('owner');
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
        const room = await Room.findOne({_id: req.params.id}).populate("owner")
        res
            .status(200)
            .json(room)
    } catch (error) {
        res
            .status(500)
            .json({message: 'Error while trying to retrieve the room information'})
    }
})

// ADD ROOM ROUTE
roomRoutes.post('/add', uploader.array('images'), async(req, res, next) => {
    // Putting the paths of the images inside an array
    console.log(req.files[0])
    const images = []
    if (req.files) {
        const files = req.files
        for (let i = 0; i < files.length; i++) {
            images.push(files[i].path)
        }
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
    if (owner === '' || property === '' || price === 0 || size === '' || bedrooms === 0 || bathrooms === 0) {
        res
            .status(400)
            .json({message: 'Please, provide all the required information'})
    }

    // Saving the non required data into variables
    const availability = req.body.availability
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
        description: description
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

    // Find the Rooms that the owner has created the room
    const findRooms = await Room.find({owner: owner})
    const roomIds = []
    findRooms.map(item => roomIds.push(item._id))
    console.log(roomIds)
    // Updating the user with the new info
    const updateUser = await User.findOneAndUpdate({
        _id: owner
    }, {
        adverts: roomIds
    }, {new: true})

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
    if (property === '' || price === 0 || size === '' || bedrooms === 0 || bathrooms === 0) {
        res
            .status(400)
            .json({message: 'Please, provide all the required information'})
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
        } else {
            res
                .status(200)
                .json({message: "The following room has been errased: ", docs})
        }
    }, {new: true})
})

module.exports = roomRoutes