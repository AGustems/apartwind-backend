const express = require('express')
const userRoutes = express.Router()
const User = require('../models/user-model')
const uploader = require('../configs/cloudinary-config')

userRoutes.put('/:id', uploader.single("imageUrl") ,async(req, res, next) => {
    // Checking if the required data has been sent
    const updatedData = req.body
    const name = req.body.name
    const surname = req.body.surname
    const email = req.body.email
    const characteristics = JSON.parse(req.body.characteristics)
    const socials = JSON.parse(req.body.socials)
    updatedData.characteristics = characteristics
    updatedData.socials = socials
    
    if (name === '' || surname === '' || email === '') {
        res
            .status(400)
            .json({message: 'Please, provide all the required information'})
        return
    }

    if(req.file){
      updatedData.imageUrl = req.file.path
    }

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

userRoutes.delete('/:id/delete', (req, res, next) => {
  User.findOneAndDelete({_id:req.params.id}, (err, docs) => {
    if(err){
      res
        .status(500)
        .json({message: "Error while trying to delete the user"})
    } else {
      res
        .status(200)
        .json({message:"The following user has been errased: ", docs})
    }
  }, {new:true})
})


module.exports = userRoutes