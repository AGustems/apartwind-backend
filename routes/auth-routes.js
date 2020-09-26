const express = require('express')
const authRoutes = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/user-model')
const {localSignup, localLogin, logout, checkLog} = require('../controllers/auth-controllers')

authRoutes
    .post('/signup', localSignup)
    .post('/login', localLogin)
    .post('/logout', logout)
    .get('/loggedin', checkLog);

module.exports = authRoutes;