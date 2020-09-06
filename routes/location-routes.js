const express = require('express')
const locationRoutes = express.Router()
const axios = require('axios')
const unidecode = require('unidecode')

// Route to get the address data from the search and serve it to the map
locationRoutes.get('/', (req, res, next) => {
    try {
        const direction = unidecode(req.query.search)
        axios
            .get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=text" +
                "query&fields=formatted_address,name,geometry,place_id&key=AIzaSyBT0RpL1Yw7Q5WC4W" +
                "emS6hyJ_Y3PnSUyfY&input=" + direction)
            .then(response => {
                res.json(response.data)
            }).catch(error => {
                res
                    .status(404)
                    .json({message: 'Address not found. Please enter a valid address'})
            })
    } catch (error) {
        res
            .status(500)
            .json({message: 'Error when trying to get the address data'})
        next(error)
    }    
})

// 

module.exports = locationRoutes