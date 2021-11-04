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
class InMemoryGeoTagStore{

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

    getNearbyGeoTags(location) {
        
    }
}

module.exports = InMemoryGeoTagStore
