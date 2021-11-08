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

    get geotags() {
        return this.#geotags;
    }

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
     * @param {*} latitude the latitude of the location.
     * @param {*} longitude the longitude of the location.
     * @returns all tags in an estimated radius of 5km around the location.
     */
    getNearbyGeoTags(latitude, longitude) {
        var inRange = [];
        for (const tag of this.#geotags) {
            var distance = this.getDistanceFromLatLonInKm(latitude, longitude, tag.latitude, tag.longitude);
            console.log("The distance is " + distance);
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
     * @param {*} latitude the latitude of the location.
     * @param {*} longitude the longitude of the location.
     * @param {*} keyword the keyword to search for.
     * @returns all tags in an estimated radius of 5km around the location which
     *          match the given keyword.
     */
    searchNearbyGeoTags(latitude, longitude, keyword) {
        var inRange = this.getNearbyGeoTags(latitude, longitude);
        var matching = [];

        if (keyword == undefined) {
            return inRange;
        }

        for (const tag of inRange) {
            if (tag.name.contains(keyword) || tag.hashtag.contains(keyword)) {
                matching.push(tag);
            }
        }

        return matching;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }
}

module.exports = InMemoryGeoTagStore
