const express = require('express')
const authRoutes = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/user-model')
const { hash } = require('bcryptjs')


// SIGNUP ROUTES
authRoutes.post('/signup',(req, res, next) =>{
  // Saving the required data
  const name = req.body.name
  const surname = req.body.surname
  const email = req.body.email
  const password = req.body.password

  // Sending feedback if the required data is missing
  if(!name || !surname || !email || !password){
    res
      .status(400)
      .json({message: 'Please, provide all the required information'})
    return
  }

  // Checking if the user already exists and sending feedback
  User.findOne({
    email
  }, (err, emailFound) => {
    if (err) {
      res
        .status(500)
        .json({message: 'The email check failed. Please try again'})
        return;
    }

    if(emailFound) {
      res
        .status(400)
        .json({message: 'This email has already been used'})
        return;
    }

    // Password encription
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    // Saving the non required data
    const age = req.body.age ? req.body.age : 99
    const occupation = req.body.occupation ? req.body.occupation : 'No occupation provided'
    const description = req.body.description ? req.body.description : 'No description provided'
    const characteristics = req.body.characteristics ? req.body.characteristics : ['No characteristics provided']
    const socials = req.body.socials ? req.body.socials : {
      facebook: 'No Facebook information provided' ,
      twitter: 'No Twitter information provided',
      instagram: 'No Instagram information provided',
    }

    // Creation of the new user
    const newUser = new User({
      name: name,
      surname: surname,
      occupation: occupation,
      age: age,
      email: email,
      password: hashPass,
      description: description,
      characteristics: characteristics,
      socials: socials
    })

    // Saving new user in the DB
    newUser.save(err => {
      if (err) {
        res
          .status(500)
          .json({message: 'Something went wrong while saving the user into de database'})
        return;
      }

      // Logging in the user after the creation
      req.login(newUser, (err) => {
        if(err) {
          res
            .status(500)
            .json({message: 'Something went wrong while logging in'})
          return;
        }

        // Sending the user information to the frontend
        res
          .status(200)
          .json(newUser)
      })
    })
  })
})


// LOGIN ROUTE
authRoutes.post('/login', (req, res, next) => {
  // Authenticating the user 
  passport.authenticate('local', (err, userDetails, errorDetails) => {
      if (err) {
          res
              .status(500)
              .json({message: 'Something went wrong while logging in'});
          return;
      }

      if (!userDetails) {
          res
              .status(401)
              .json(errorDetails);
          return;
      }

      // Saving the user in session
      req.login(userDetails, (err) => {
          if (err) {
              res
                  .status(500)
                  .json({message: 'Something went wrong while saving the session.'});
              return;
          }
          // Sending the user back
          res
              .status(200)
              .json(userDetails);
      });
  })(req, res, next);
});


// LOGOUT ROUTE
authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res
      .status(200)
      .json({message: 'Log out success!'});
});


// LOG CHECK ROUTE
authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
      res
          .status(200)
          .json(req.user);
      return;
  }
  res
      .status(403)
      .json({message: 'User not in session'});
});

module.exports = authRoutes;