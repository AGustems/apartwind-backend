require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const app = express();
const session       = require('express-session');
const passport      = require('passport');

const cors = require('cors')
require('./configs/passport-config');

// Database configuration
require('./configs/db-config');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Session settings
app.use(session({
  secret:"some secret goes here",
  resave: true,
  saveUninitialized: true
}));

// Passport initializer
app.use(passport.initialize())
app.use(passport.session())

// default value for title local
app.locals.title = 'Roomer - The best platform for finding your new roommate';

// Space for cors settings
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://roomer-app.herokuapp.com/']
  })
)

// Routes middlewares
const index = require('./routes/index');
const authRoutes = require('./routes/auth-routes');
const userRoutes = require('./routes/user-routes');
const roomRoutes = require('./routes/room-routes');
const locationRoutes = require('./routes/location-routes');

app.use('/', index);
app.use('/auth', authRoutes);
app.use('/userprofile', userRoutes);
app.use('/rooms', roomRoutes);
app.use('/maps', locationRoutes)

// Fix routes for deployment
//app.use((req, res, next) => {
//  res.sendFile(path.join(__dirname, "build", "index.html"));
//});

module.exports = app;