const passport = require('passport')
const bcrypt = require('bcrypt')
const {transporter, greetings} = require('../configs/nodemailer-config');
const User = require('../models/user-model')

// SIGNUP CONTROLLER
const localSignup = (req, res, next) =>{
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

  // Checking if the email already exists and sending feedback
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

    // Checking if the email has the required format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if(!emailRegex.test(email)){
      res
        .status(400)
        .json({message: "The email has an incorrect format, please submit a valid email"})
        return;
    }

    // Checking that the password meets the necessary format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!passwordRegex.test(password)) {
      res
        .status(400)
        .json({message: 'The password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter.'})
        return;
    };

    // Password encription
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    // Saving the non required data
    const age = req.body.age ? req.body.age : 99
    const occupation = req.body.occupation ? req.body.occupation : 'No occupation provided'
    const description = req.body.description ? req.body.description : 'No description provided'
    const characteristics = req.body.characteristics ? req.body.characteristics : ['No characteristics provided']
    const socials = req.body.socials ? req.body.socials : {
      facebook: '' ,
      twitter: '',
      instagram: '',
    }

    // Checking if the socials are empty or have the required format (FACEBOOK)
    const facebookRegex = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/
    if(socials.facebook !== ''){
        if(!facebookRegex.test(socials.facebook)){
            res
                .status(400)
                .json({message: "The facebook URL submited was incorrect. It must start with www.facebook.com/"})
                return;
        }
    }
    
    // Checking if the socials are empty or have the required format (TWITTER)
    const twitterRegex = /^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9(\.\?)?]/
    if(socials.twitter !== ''){
        if(!twitterRegex.test(socials.twitter)){
            res
                .status(400)
                .json({message: "The twitter URL submited was incorrect. It must start with www.twitter.com/"})
                return;
        }
    }
    
    // Checking if the socials are empty or have the required format (INSTAGRAM)
    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram.com\/[a-zA-Z0-9(\.\?)?]/
    if(socials.instagram !== ''){
        if(!instagramRegex.test(socials.instagram)){
            res
                .status(400)
                .json({message: "The instagram URL submited was incorrect. It must start with www.instagram.com/"})
                return;
        }
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

      // Sending a welcome email to the user
      const mailG = transporter.sendMail({
        from: process.env.GMAIL_ACCOUNT,
        to: email,
        subject: "Welcome to Roomer!",
        html: greetings(name, surname, email),
      }, (error, info) => error ? console.log(error) : console.log('Email sent: ' + info.response))

      // Logging in the user after the creation
      req.login(newUser, (err) => {
        if(err) {
          res
            .status(500)
            .json({message: 'Something went wrong while trying to logging in'})
          return;
        }

        // Sending the user information to the frontend
        res
          .status(200)
          .json(newUser)
      })
    })
  })
}

// LOGIN CONTROLLER
const localLogin = (req, res, next) => {
  // Authenticating the user 
  passport.authenticate('local', (err, userDetails, errorDetails) => {
      if (err) {
          res
              .status(500)
              .json({message: 'Something went wrong while logging in, please, check if the email and password are correct.'});
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
}

// LOGOUT CONTROLLER
const logout = (req, res, next) => {
  req.logout();
  res
      .status(200)
      .json({message: 'Log out success!'});
}

// LOG CHECK CONTROLLER
const checkLog = (req, res, next) => {
  if (req.isAuthenticated()) {
      res
          .status(200)
          .json(req.user);
      return;
  }
  res
      .status(403)
      .json({message: 'User not in session'});
}

module.exports = {localSignup, localLogin, logout, checkLog}