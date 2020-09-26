const express = require('express')
const roomRoutes = express.Router()
const uploader = require('../configs/cloudinary-config')

const {
    getRooms,
    getOneRoom,
    addRoom,
    getFavs,
    editRoom,
    deleteRoom,
    getAdds, 
    getOffers,
    makeOffer,
    retrieveOffer
} = require('../controllers/room-controllers.js')

roomRoutes
    .get('/', getRooms)
    .get('/:id', getOneRoom)
    .patch('/:id', getFavs)
    .post('/add', uploader.array('images'), addRoom)
    .put('/:id/edit', uploader.array("images"), editRoom)
    .delete('/:id/delete', deleteRoom)
    .get('/userAds/:id', getAdds)
    .get('/userOffers/:id', getOffers)
    .put('/:id/newOffer', makeOffer)
    .put('/:id/deleteOffer', retrieveOffer)

module.exports = roomRoutes