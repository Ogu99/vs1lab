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

  var t_lat = req.body.latitude;
  var t_long = req.body.longitude;

  var tags = req.app.get('memory').geotags;
  var tags_S = JSON.stringify(tags);

  res.render('index', { 
    taglist: tags,
    img_taglist: tags_S, 
    tagging_latitude : t_lat, 
    tagging_longitude : t_long,
    discovery_latitude : t_lat,
    discovery_longitude : t_long})
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
router.post('/tagging', (req, res) => {
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var name = req.body.name;
  var hashtag = req.body.hashtag;

  var tag = new GeoTag(latitude, longitude, name, hashtag);
  req.app.get('memory').addGeoTag(tag);

  var tags = req.app.get('memory').getNearbyGeoTags(latitude, longitude);
  var tags_S = JSON.stringify(GeoTagStore.toObj(tags));

  res.render('index', { 
    taglist: tags,
    img_taglist: tags_S,
    tagging_latitude : latitude, 
    tagging_longitude : longitude,
    discovery_latitude : latitude,
    discovery_longitude : longitude
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

  var tags = req.app.get('memory').searchNearbyGeoTags(latitude, longitude, name);
  var tags_S = JSON.stringify(GeoTagStore.toObj(tags));

  res.render('index', { 
      taglist: tags,
      img_taglist: tags_S,
      tagging_latitude : latitude, 
      tagging_longitude : longitude,
      discovery_latitude : latitude,
      discovery_longitude : longitude
  });
});


module.exports = router;
