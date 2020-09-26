const express = require('express')
const locationRoutes = express.Router()
const {getLocation} = require('../controllers/location-controllers')

locationRoutes.get('/', getLocation)

module.exports = locationRoutes