// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const app = require('../app');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');
const { tagList } = require('../models/geotag-examples');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  for (const tag of tagList) {
      addTag = new GeoTag(tag[1], tag[2], tag[0], tag[3]);
      req.app.get('memory').addGeoTag(addTag);
  }

  var t_lat = req.body.latitude;
  var t_long = req.body.longitude;

  var d_lat = req.body.d_latitude;
  var d_long = req.body.d_longitude;

  res.render('index', { taglist: req.app.get('memory').geotags, 
    tagging_latitude : t_lat, 
    tagging_longitude : t_long,
    discovery_latitude : d_lat,
    discovery_longitude : d_long})
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */
//router.use(express.urlencoded({ extended: true }))

router.post('/tagging', (req, res) => {
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var name = req.body.name;
  var hashtag = req.body.hashtag;

  var d_lat = req.body.d_latitude;
  var d_long = req.body.d_longitude;

  var tag = new GeoTag(latitude, longitude, name, hashtag);
  req.app.get('memory').addGeoTag(tag);

  res.render('index', { taglist: req.app.get('memory').getNearbyGeoTags(latitude, longitude),
    tagging_latitude : latitude, 
    tagging_longitude : longitude,
    discovery_latitude : d_lat,
    discovery_longitude : d_long
  });  
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */
router.post('/discovery', (req, res) => {
  var latitude = req.body.d_latitude;
  var longitude = req.body.d_longitude;
  var name = req.body.search_key;

  var t_latitude = req.body.latitude;
  var t_longitude = req.body.longitude;

  res.render('index', { taglist: req.app.get('memory').searchNearbyGeoTags(latitude, longitude, name),
      tagging_latitude : t_latitude, 
      tagging_longitude : t_longitude,
      discovery_latitude : latitude,
      discovery_longitude : longitude
  });
});


module.exports = router;
