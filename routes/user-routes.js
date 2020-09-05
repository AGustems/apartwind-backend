const express = require('express')
const userRoutes = express.Router()
const User = require('../models/user-model')
const uploader = require('../configs/cloudinary-config')

// GET CONCRET USER INFORMATION
userRoutes.get('/:id', async(req, res, next) => {
    // Return the user with the id sent as a parameter in the URL
    try {
        const user = await User
            .findOne({_id: req.params.id})
            .populate({
                path: "favourites",
                populate: {
                    path: "owner"
                }
            })
            .populate("adverts")   
        
        res
            .status(200)
            .json(user)
    } catch (error) {
        res
            .status(500)
            .json({message: 'Error while trying to retrieve the user information'})
    }
})

// UPDATE USERPROFILE ROUTE
userRoutes.put('/:id', uploader.single("imageUrl"), async(req, res, next) => {
    // Saving the required data into variables
    const updatedData = req.body
    const name = req.body.name
    const surname = req.body.surname
    const email = req.body.email

    // Necessary transformation because of the new FormData in the frontend
    const characteristics = JSON.parse(req.body.characteristics)
    const socials = JSON.parse(req.body.socials)
    updatedData.characteristics = characteristics
    updatedData.socials = socials

    //Checking if the required data has been sent
    if (name === '' || surname === '' || email === '') {
        res
            .status(400)
            .json({message: 'Please, provide all the required information'})
        return
    }

    if (req.file) {
        updatedData.imageUrl = req.file.path
    }

    // Finding the user and updating the data with the information sent
    try {
        const updateUser = await User.findOneAndUpdate({
            _id: req.params.id
        }, updatedData, {new: true})
        res
            .status(200)
            .json(updateUser)
    } catch (error) {
        res
            .status(500)
            .json({message: "Error while updating the user's information"})
        next(error)
    }
})

// DELETE USERPROFILE ROUTE
userRoutes.delete('/:id/delete', (req, res, next) => {
    // Finding the user with the URL parameters and errasing it from the DB
    User.findOneAndDelete({
        _id: req.params.id
    }, (err, docs) => {
        if (err) {
            res
                .status(500)
                .json({message: "Error while trying to delete the user"})
        } else {
            res
                .status(200)
                .json({message: "The following user has been errased: ", docs})
        }
    }, {new: true})
})

module.exports = userRoutes