const express = require('express')
const userRoutes = express.Router()
const uploader = require('../configs/cloudinary-config')
const {getUserInfo, updateUser, deleteUser} = require('../controllers/user-controllers')

userRoutes
        .get('/:id', getUserInfo)
        .put('/:id', uploader.single("imageUrl"), updateUser)
        .delete('/:id/delete', deleteUser)

module.exports = userRoutes