// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

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

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
    const searchterm = req.query.searchterm;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    var tags = {
      geotags: []
    }

    if (searchterm && latitude && longitude) {
      const results = req.app.get('memory').searchNearbyGeoTags(latitude, longitude, searchterm);
      results.map(function(item) {
        tags.geotags.push(
          {
            "latitude": item.latitude,
            "longitude": item.longitude,
            "name": item.name,
            "hashtag": item.hashtag,
            "id": item.id
          }
        )
      });
    } else if (searchterm) {
      const results = req.app.get('memory').searchGeoTags(searchterm);
      results.map(function(item) {
        tags.geotags.push(
          {
            "latitude": item.latitude,
            "longitude": item.longitude,
            "name": item.name,
            "hashtag": item.hashtag,
            "id": item.id
          }
        )
      });
    } else {
      const results = req.app.get('memory').geotags;
      results.map(function(item) {
        tags.geotags.push(
          {
            "latitude": item.latitude,
            "longitude": item.longitude,
            "name": item.name,
            "hashtag": item.hashtag,
            "id": item.id
          }
        )
      });
    }

    res.send(tags);
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
    const tag = {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      name: req.body.name,
      hashtag: req.body.hashtag
    };

    const add = new GeoTag(req.body.latitude, req.body.longitude, req.body.name, req.body.hashtag);
    req.app.get('memory').addGeoTag(add);

    const index = req.app.get('memory').indexOf(add);
    res.set('URL', `api/geotags/${index}`);
    res.send(tag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', (req, res) => {
    const tag = req.app.get('memory').getGeoTag(parseInt(req.params.id));
    if (!tag) res.status(404).send('The geotag with the given ID was not found!');
    res.send({
      "latitude": tag.latitude,
      "longitude": tag.longitude,
      "name": tag.name,
      "hashtag": tag.hashtag
    });
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', (req, res) => {
  const reqTag = new GeoTag(req.body.latitude, req.body.longitude, req.body.name, req.body.hashtag);
  const tag = req.app.get('memory').setGeoTag(parseInt(req.params.id), reqTag);
  if (!tag) res.status(404).send('The geotag with the given ID was not found!');
  res.send({
    "latitude": tag.latitude,
    "longitude": tag.longitude,
    "name": tag.name,
    "hashtag": tag.hashtag
  });
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', (req, res) => {
  const tag = req.app.get('memory').removeGeoTagById(parseInt(req.params.id));
  if (!tag) res.status(404).send('The geotag with the given ID was not found!');
  res.send({
    "latitude": tag.latitude,
    "longitude": tag.longitude,
    "name": tag.name,
    "hashtag": tag.hashtag
  });
});

module.exports = router;
