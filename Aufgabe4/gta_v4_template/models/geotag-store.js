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

    constructor (taglist = []) {
        for (var tag of taglist) {
            var addTag = new GeoTag(tag[1], tag[2], tag[0], tag[3], this.#geotags.length + 1);
            this.addGeoTag(addTag);
        }
    }

    get geotags() {
        return this.#geotags;
    }

    static toObj(taglist) {
        var obj = [];
        for (var tag of taglist) {
            obj.push(tag.toObj());
        }
        return obj;
    }

    /**
     * Adds the given geotag to the storage.
     * 
     * @param {*} geotag the geotag to add.
     */
    addGeoTag(geotag) {
        const tag = new GeoTag(geotag.latitude, geotag.longitude, geotag.name, geotag.hashtag, this.#geotags.length + 1);
        this.#geotags.push(tag);
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

    removeGeoTagById(id) {
        var tag = this.getGeoTag(id);
        if (tag) {
            const index = this.#geotags.indexOf(tag);
            this.#geotags.splice(index, 1);
            for (var i = index; i < this.#geotags.length; i++) {
                var current = this.#geotags[i];
                current.changeId = current.id - 1;
            }

            return tag;
        }
    }

    /**
     * Returns the geotag with the given id, if it exists.
     * 
     * @param {*} id the id of the geotag to return.
     * @returns the geotag if found.
     */
    getGeoTag(id) {
        for (const tag of this.#geotags) {
            if (id === tag.id) {
                return tag;
            }
        }
    }

    indexOf(geotag) {
        for (const tag of this.#geotags) {
            if (geotag.latitude === tag.latitude && geotag.longitude === tag.longitude && geotag.name === tag.name && geotag.hashtag === tag.hashtag) {
                return tag.id;
            }
        }
    }

    setGeoTag(id, geotag) {
        var tag = this.getGeoTag(id);
        if (tag) {
            console.log(geotag.latitude);
            tag.changeLat = geotag.latitude;
            tag.changeLong = geotag.longitude;
            tag.changeName = geotag.name;
            tag.changeHashtag = geotag.hashtag;

            console.log(tag);

            return tag;
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
        console.log("In range " + inRange);
        var matching = [];

        for (const tag of inRange) {
            if (tag.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1 || tag.hashtag.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                console.log("Matching " + tag.name);
                matching.push(tag);
            }
        }

        return matching;
    }

    searchGeoTags(keyword) {
        var matching = [];

        for (const tag of this.#geotags) {
            if (tag.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1 || tag.hashtag.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                console.log("Matching " + tag.name);
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
