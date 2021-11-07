// File origin: VS1LAB A3

const GeoTag = require("./geotag");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */

 const radius = 5; //5 km radius to search for nearby locations.

class InMemoryGeoTagStore {
    #geotags = [];

    /**
     * Adds the given geotag to the storage.
     * 
     * @param {*} geotag the geotag to add.
     */
    addGeoTag(geotag) {
        this.#geotags.push(geotag);
    }

    /**
     * Removes the given geotag object from the storage.
     * 
     * @param {*} geotag the geotag to remove from the storage. 
     */
    removeGeoTag(geotag) {
        const index = this.#geotags.indexOf(geotag);
        if (index > -1) {
            this.#geotags.splice(index, 1);
        }
    }

    /**
     * Gets all tags in a range of 5km around the given location and returns them.
     * 
     * @param {*} location the location to search around.
     * @returns all tags in an estimated radius of 5km around the location.
     */
    getNearbyGeoTags(location) {
        inRange = [];
        for (const tag of this.#geotags) {
            distance = this.getDistanceFromLatLonInKm(location.latitude, location.longitude, tag.latitude, tag.longitude);
            if (distance <= radius) {
                inRange.push(tag);
            }
        }

        return inRange;
    }

    /**
     * Gets all tags in a range of 5km around the given location which match a given
     * keyword and returns them.
     * 
     * @param {*} location the location to search around.
     * @param {*} keyword the keyword to search for.
     * @returns all tags in an estimated radius of 5km around the location which
     *          match the given keyword.
     */
    searchNearbyGeoTags(location, keyword) {
        inRange = this.getNearbyGeoTags(location);
        matching = [];

        for (const tag of inRange) {
            if (tag.name.includes(keyword) || tag.hashtag.includes(keyword)) {
                matching.push(tag);
            }
        }

        return matching;
    }

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }
      
    deg2rad(deg) {
        return deg * (Math.PI/180)
    }
}

module.exports = InMemoryGeoTagStore
