const express = require('express')
const locationRoutes = express.Router()
const axios = require('axios')
const unidecode = require('unidecode')

// Route to get the address data from the search and serve it to the map
locationRoutes.get('/', (req, res, next) => {
    const direction = unidecode(req.query.search)
    console.log(direction)
    axios
        .get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=text" +
            "query&fields=formatted_address,name,geometry,place_id&key=AIzaSyBT0RpL1Yw7Q5WC4W" +
            "emS6hyJ_Y3PnSUyfY&input=" + direction)
        .then(response => {
            res.json(response.data)
        })
})

// 

module.exports = locationRoutes