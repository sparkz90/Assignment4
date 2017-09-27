var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    listingsRouter = require('../routes/listings.server.routes'),
    getListings = require('../controllers/listings.server.controller.js'),
    getCoordinates = require('../controllers/coordinates.server.controller.js');

module.exports.init = function() {
  //connect to database
  mongoose.connect(config.db.uri);

  //initialize app
  var app = express();

  //enable request logging for development debugging
  app.use(morgan('dev'));

  //body parsing middleware
  app.use(bodyParser.json());

  /* serve static files */
  app.use(express.static(path.join(__dirname , '../../client/')));

  /* use the listings router for requests to the api */
  app.use('/api/listings/', listingsRouter);

  /* go to homepage for all routes not specified */
  app.use('*', function(req, res){
    res.redirect('/');
  });

  /* server wrapper around Google Maps API to get latitude + longitude coordinates from address */
  app.post('/api/coordinates', getCoordinates, function(req, res) {
    res.send(req.results);
  });

  return app;
};